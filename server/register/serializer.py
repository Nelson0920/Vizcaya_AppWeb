from rest_framework import serializers
from .models import User, Client, Module
import bcrypt


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    pwd_reg = serializers.CharField(write_only=True)
    module = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'nam_reg', 'eml_reg', 'cell_reg', 'role', 'module', 'fec_reg', 'del_reg', 'pwd_reg']

    def create(self, validated_data):
        password = validated_data.pop('pwd_reg')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        validated_data['pwd_reg'] = hashed_password.decode('utf-8')
        return super().create(validated_data)

    def get_module(self, instance):
        # Obtenemos el módulo personalizado del usuario
        custom_module = instance.custom_module

        # Si el usuario tiene un módulo personalizado, serializamos ese módulo
        if custom_module:
            return ModuleSerializer(custom_module).data
        else:
            # Si el usuario no tiene un módulo personalizado, mostramos el módulo asociado a su rol
            return ModuleSerializer(instance.role.module).data


class LoginSerializer(serializers.Serializer):
    eml_reg = serializers.CharField()
    pwd_reg = serializers.CharField()

    def validate(self, data):
        email = data.get('eml_reg')
        password = data.get('pwd_reg')

        try:
            user_obj = User.objects.get(eml_reg=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Usuario no encontrado')

        if not bcrypt.checkpw(password.encode('utf-8'), user_obj.pwd_reg.encode('utf-8')):
            raise serializers.ValidationError('Contraseña incorrecta')

        return data


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

