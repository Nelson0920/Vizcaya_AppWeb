from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Product, Comment, Category, Order, OrderDetail, FeaturedProduct
from register.serializer import UserSerializer, ClientSerializer
from django.db.models.functions import Coalesce, ExtractMonth, ExtractYear
from register.models import Client, User
from django.db.models import Sum, Count, IntegerField
from django.http import JsonResponse
from django.utils import timezone
from .serializer import ProductSerializer, FeaturedProductSerializer, CommentSerializer, CategorySerializer, OrderSerializer, OrderDetailSerializer, OrderSerializer2

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.action == 'comments':
            return CommentSerializer
        return self.serializer_class

    @action(detail=True, methods=['GET'])
    def comments(self, request, pk=None):
        try:
            product = self.get_object()
            comments = Comment.objects.filter(prd_com=product)
            serializer = self.get_serializer(comments, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response_data = serializer.data

        category = Category.objects.get(id=response_data['cat_prd'])
        category_serializer = CategorySerializer(category)
        response_data['cat_prd'] = category_serializer.data['cat_prd']

        return Response(response_data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        response_data = serializer.data

        for item in response_data:
            category = Category.objects.get(id=item['cat_prd'])
            category_serializer = CategorySerializer(category)
            item['cat_prd'] = category_serializer.data['cat_prd']

        return Response(response_data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_product(self, product_pk):
        try:
            product = Product.objects.get(id=product_pk)
            return product
        except Product.DoesNotExist:
            return None

    @action(detail=True, methods=['get'])
    def comments(self, request, product_pk=None):
        product = self.get_product(product_pk)
        if not product:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        comments = Comment.objects.filter(prd_com=product)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


class CreateCommentAPIView(APIView):
    def post(self, request, product_pk):
        try:
            product = Product.objects.get(id=product_pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        comment_data = {
            'prd_com': product.id,
            'cont_com': request.data.get('cont_com'),
            'nom_com': request.data.get('nom_com'),
        }

        serializer = CommentSerializer(data=comment_data, context={'product_pk': product_pk})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateProductQtyAPIView(APIView):
    def patch(self, request, pk):
        try:
            product = Product.objects.get(id=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        difference = request.data.get('qty_prd')

        if difference is None:
            return Response({'detail': 'qty_prd is required'}, status=status.HTTP_400_BAD_REQUEST)

        product.qty_prd = difference
        product.save()

        serializer = ProductSerializer(product)
        return Response(serializer.data)
    


class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny] 


class OrderDetailListCreateView(generics.ListCreateAPIView):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [AllowAny] 
    
    
class OrderDetailView(APIView):
    def get(self, request, user_id):
        clients = Client.objects.filter(id_user=user_id)
        client_ids = clients.values_list('id', flat=True)
        orders = Order.objects.filter(id_cli__in=client_ids)
        serializer = OrderSerializer2(orders, many=True)

        order_data = serializer.data

        for order in order_data:
            order_details_data = order['order_details']
            for order_detail_data in order_details_data:
                product_data = order_detail_data['product']
                product_id = product_data['id']
                product_data['img_prd'] = request.build_absolute_uri(Product.objects.get(id=product_id).img_prd.url)

        return Response(order_data)

class OrderDetailDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer


class UserDetailView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        # Obtener los datos de clientes, órdenes y detalles de órdenes para cada usuario
        user_data = serializer.data

        for user in user_data:
            clients = Client.objects.filter(id_user=user['id'])
            client_data = ClientSerializer(clients, many=True).data
            user['clients'] = client_data

            client_ids = clients.values_list('id', flat=True)
            orders = Order.objects.filter(id_cli__in=client_ids)
            order_data = OrderSerializer(orders, many=True).data
            user['orders'] = order_data

            order_ids = orders.values_list('id', flat=True)
            order_details = OrderDetail.objects.filter(id_ord__in=order_ids)
            order_detail_data = OrderDetailSerializer(order_details, many=True).data
            user['order_details'] = order_detail_data

            # Obtener los productos asociados a cada detalle de orden
            product_ids = [order_detail['id_prd'] for order_detail in order_detail_data]
            products = Product.objects.filter(id__in=product_ids)
            product_data = ProductSerializer(products, many=True).data

            # Asociar los productos correspondientes a cada detalle de orden
            for order_detail in order_detail_data:
                for product in product_data:
                    if order_detail['id_prd'] == product['id']:
                        order_detail['product'] = product
                        break

        return Response(user_data)


@api_view(['GET'])
def top_products(request):
    # Obtener el top 5 de productos más comprados
    top_products = Product.objects.annotate(total_qty_sold=Coalesce(Sum('order_details__qty_prd'), 0)).order_by('-total_qty_sold')
    
    # Crear una lista con el nombre del producto, la cantidad vendida y la categoría a la que pertenece
    top_products_data = [
        {
            'product_name': product.nam_prd,
            'total_qty_sold': product.total_qty_sold,
            'category': product.cat_prd.cat_prd  # Aquí accedemos al nombre de la categoría
        }
        for product in top_products[:5]  # Limitamos a los primeros 5 productos más vendidos
    ]
    
    return Response(top_products_data)


@api_view(['GET'])
def top_categories(request):
    top_categories = Category.objects.annotate(total_qty_sold=Count('product__order_details')).order_by('-total_qty_sold')[:5]

    top_categories_data = [
        {
            'category_name': category.cat_prd,
            'total_qty_sold': category.total_qty_sold,
        }
        for category in top_categories
    ]

    return Response(top_categories_data)


import calendar

# Diccionario que mapea números de meses a nombres abreviados en español
MONTH_NAMES_ES = {
    1: 'ene',
    2: 'feb',
    3: 'mar',
    4: 'abr',
    5: 'may',
    6: 'jun',
    7: 'jul',
    8: 'ago',
    9: 'sep',
    10: 'oct',
    11: 'nov',
    12: 'dic',
}

@api_view(['GET'])
def top_selling_months(request):
    current_year = timezone.now().year
    current_month = timezone.now().month

    # Obtener todos los meses del año actual
    months = list(range(1, 13))

    # Filtrar las ventas del año actual y realizar una unión izquierda con todos los meses
    top_months = (
        OrderDetail.objects
        .filter(id_ord__fec_ord__year=current_year)
        .annotate(month=ExtractMonth('id_ord__fec_ord'))
        .values('month')
        .annotate(total_sales=Count('id_ord__id'))
        .order_by('month')
    )

    # Crear un diccionario para almacenar el total de ventas para cada mes
    sales_by_month = {month: 0 for month in months}

    # Actualizar el diccionario con los datos de ventas reales
    for entry in top_months:
        month = entry['month']
        total_sales = entry['total_sales']
        sales_by_month[month] = total_sales

    # Crear una lista con los datos de ventas para cada mes
    top_months_data = [{'month': MONTH_NAMES_ES[month], 'total_sales': sales_by_month[month]} for month in months]

    return Response(top_months_data)


@api_view(['GET'])
def total_sales_by_month(request):
    current_year = timezone.now().year
    current_month = timezone.now().month

    # Obtener todos los meses del año actual
    months = list(range(1, 13))

    # Filtrar las ventas del año actual y realizar una unión izquierda con todos los meses
    sales_by_month = (
        Order.objects
        .filter(fec_ord__year=current_year)
        .annotate(month=ExtractMonth('fec_ord'))
        .values('month')
        .annotate(total_sales=Sum('tot_ord'))
        .order_by('month')
    )

    # Crear un diccionario para almacenar el total de ventas para cada mes
    total_sales_data = {month: 0 for month in months}

    # Actualizar el diccionario con los datos de ventas reales
    for entry in sales_by_month:
        month = entry['month']
        total_sales = entry['total_sales']
        total_sales_data[month] += total_sales

    # Crear una lista con los datos de ventas para cada mes
    sales_data = [{'month': MONTH_NAMES_ES[month], 'total_sales': str(total_sales_data[month])+'$'} for month in months]

    return Response(sales_data)


class FeaturedProductListView(generics.ListCreateAPIView):
    serializer_class = FeaturedProductSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return FeaturedProduct.objects.filter(id_user_id=user_id)

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        product_id = request.data.get('product')
        stars = request.data.get('rank_prd')

        if not (product_id and stars):
            return Response({'detail': 'Both product and rank_prd are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            featured_product = FeaturedProduct.objects.get(id_user_id=user_id, product_id=product_id)
            featured_product.rank_prd = stars
            featured_product.save()
            return Response({'detail': 'Product rating updated successfully.'}, status=status.HTTP_200_OK)
        except FeaturedProduct.DoesNotExist:
            featured_product = FeaturedProduct.objects.create(id_user_id=user_id, product_id=product_id, rank_prd=stars)
            return Response({'detail': 'Product rating saved successfully.'}, status=status.HTTP_201_CREATED)
        

@api_view(['GET'])
def product_stars_summary(request, product_id):
    try:
        # Filtrar FeaturedProduct por el producto específico y realizar la agregación para sumar las estrellas
        total_stars = FeaturedProduct.objects.filter(product_id=product_id).aggregate(Sum('rank_prd'))['rank_prd__sum']
        # Contar el número de usuarios únicos que han dado estrellas al producto
        total_users = FeaturedProduct.objects.filter(product_id=product_id).values('id_user').distinct().count()

        # Calcular el porcentaje proporcional
        if total_stars is not None:
            total_stars = max(total_stars, 0)
            total_users = max(total_users, 1)  # Evitar división por cero
            average_stars = total_stars / total_users
            total_stars_percent = (average_stars / 5.0) * 100  # 5 es el número máximo de estrellas

            # Ajustar el resultado para que esté en el rango de 1 a 5
            total_stars_percent = max(min(total_stars_percent, 100), 0)  # Asegurar que esté entre 0 y 100
            stars_scale = 5.0
            scaled_stars = (total_stars_percent / 100) * stars_scale
        else:
            scaled_stars = 0.0

        # Crear un diccionario con los resultados
        result = {
            'product_id': product_id,
            'total_stars': total_stars,
            'total_users': total_users,
            'scaled_stars': scaled_stars,
        }

        return Response(result)
    except FeaturedProduct.DoesNotExist:
        return Response({'error': 'El producto especificado no existe.'}, status=404)
    



#-----------Auditoria--------------------
from .models import ProductAudit
from .serializer import ProductAuditSerializer


@api_view(['POST'])
def create_product_audit(request):
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')
    action = request.data.get('action')

    # Verificar que los campos requeridos estén presentes en la solicitud
    if not all([user_id, product_id, action]):
        return Response({'error': 'user_id, product_id, and action are required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Obtener los objetos de usuario y producto correspondientes
        user = User.objects.get(pk=user_id)
        product = Product.objects.get(pk=product_id)

        # Crear el registro de auditoría con los valores de las claves primarias de usuario y producto
        audit_data = {
            'user': user.id,  # Aquí se usa user.id en lugar de user
            'product': product.id,  # Aquí se usa product.id en lugar de product
            'action': action
        }

        serializer = ProductAuditSerializer(data=audit_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'error': 'User with the specified ID does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product with the specified ID does not exist.'}, status=status.HTTP_404_NOT_FOUND)
