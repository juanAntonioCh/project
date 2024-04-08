from rest_framework import serializers
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
        fields = ['imagen']


class VehicleSerializer(serializers.ModelSerializer):
    marca_details = MarcaSerializer(source='marca', read_only=True)
    modelo_details = ModeloSerializer(source='modelo', read_only=True)
    marca_id = serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all(), write_only=True, source='marca')
    modelo_id = serializers.PrimaryKeyRelatedField(queryset=Modelo.objects.all(), write_only=True, source='modelo')
    imagenes = ImagenVehiculoSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'

    def create(self, validated_data):
        # `validated_data` ya tendrá 'marca' y 'modelo' como instancias del modelo gracias a `source='marca'` y `source='modelo'`
        # así que puedes pasar `validated_data` directamente a `Vehicle.objects.create()`
        vehicle = Vehicle.objects.create(**validated_data)
        return vehicle