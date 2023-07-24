from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics
from .serializer import UserSerializer, LoginSerializer, ClientSerializer
from .models import User, Client
import bcrypt


@api_view(['POST'])
def create_register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Registro creado exitosamente'}, status=status.HTTP_201_CREATED)
    else:
        if 'eml_reg' in serializer.errors and 'unique' in serializer.errors['eml_reg'][0].lower():
            return Response({'error': 'El correo electrónico ya está en uso'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['eml_reg']
        password = serializer.validated_data['pwd_reg']

        try:
            user_obj = User.objects.get(eml_reg=email)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if not bcrypt.checkpw(password.encode('utf-8'), user_obj.pwd_reg.encode('utf-8')):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener los datos del usuario serializados
        user_serializer = UserSerializer(user_obj)
        user_data = user_serializer.data

        # Agregar los datos del usuario al mensaje de respuesta
        response_data = {
            'message': 'Inicio de sesión exitoso',
            'user': user_data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user_obj = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user_obj, data=request.data, partial=True)
    if serializer.is_valid():
        # Encriptar la contraseña antes de guardarla
        if 'pwd_reg' in request.data:
            password = request.data['pwd_reg']
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            serializer.validated_data['pwd_reg'] = hashed_password.decode('utf-8')

        serializer.save()
        return Response({'message': 'Datos de usuario actualizados exitosamente'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientCreateView(generics.CreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer



