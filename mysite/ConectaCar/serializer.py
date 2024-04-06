from rest_framework import serializers
from .models import *

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre']

class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = ['nombre']

class ImagenVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenVehiculo
        fields = ['imagen']


class VehicleSerializer(serializers.ModelSerializer):
    marca = MarcaSerializer(read_only=True)
    modelo = ModeloSerializer(read_only=True)
    imagenes = ImagenVehiculoSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'