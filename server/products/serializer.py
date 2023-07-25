from rest_framework import serializers
from .models import Product, Comment, Category, Order, OrderDetail, FeaturedProduct
from register.serializer import UserSerializer

class ProductSerializer(serializers.ModelSerializer):
    img_prd = serializers.ImageField(max_length=None, allow_empty_file=False, use_url=True)

    class Meta:
        model = Product
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        product_pk = self.context.get('product_pk')
        product = Product.objects.get(id=product_pk)

        validated_data['prd_com'] = product

        comment = Comment.objects.create(**validated_data)
        return comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
        

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = ['id', 'id_ord', 'id_prd', 'qty_prd', 'sub_prd']



class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'fec_ord', 'sub_iva', 'tot_ord', 'id_cli']
        

class OrderSerializer2(serializers.ModelSerializer):
    order_details = serializers.SerializerMethodField()

    def get_order_details(self, order):
        order_details = order.order_details.all()
        order_detail_data = []
        for order_detail in order_details:
            order_detail_serializer = OrderDetailSerializer(order_detail)
            order_detail_data.append({
                'order_detail': order_detail_serializer.data,
                'product': ProductSerializer(order_detail.id_prd).data
            })
        return order_detail_data

    class Meta:
        model = Order
        fields = ('id', 'fec_ord', 'sub_iva', 'tot_ord', 'order_details')


class FeaturedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedProduct
        fields = '__all__'


#-----------Auditoria--------------------


from .models import ProductAudit

class ProductAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAudit
        fields = '__all__'


class GetProductAuditSerializer(serializers.ModelSerializer):
    nam_reg = serializers.CharField(source='user.nam_reg', read_only=True)  
    nam_prd = serializers.CharField(source='product.nam_prd', read_only=True)  
    action = serializers.CharField(source='get_action_display', read_only=True)  

    class Meta:
        model = ProductAudit
        fields = ['id', 'nam_reg', 'nam_prd', 'action', 'timestamp']