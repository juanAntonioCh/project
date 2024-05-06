from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre']

class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = ['id', 'nombre']

class ImagenVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenVehiculo
        fields = ['id', 'vehiculo', 'imagen']

class PropietarioVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class VehicleSerializer(serializers.ModelSerializer):
    marca_details = MarcaSerializer(source='marca', read_only=True)
    modelo_details = ModeloSerializer(source='modelo', read_only=True)
    propietario_details = PropietarioVehiculoSerializer(source='propietario', read_only=True)
    marca_id = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), write_only=True, source='marca')
    modelo_id = serializers.PrimaryKeyRelatedField(queryset=Modelo.objects.all(), write_only=True, source='modelo')
    propietario_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source='propietario')
    imagenes = ImagenVehiculoSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
