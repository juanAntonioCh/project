from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import status
import json
from django.core.files.base import ContentFile
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializer import *
from .models import *

# Create your views here.
class VehicleView(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()


class MarcaView(viewsets.ModelViewSet):
    serializer_class = MarcaSerializer
    queryset = Marca.objects.all()


class ModeloView(viewsets.ModelViewSet):
    serializer_class = ModeloSerializer
    queryset = Modelo.objects.all()

class ImagenVehiculoView(viewsets.ModelViewSet):
    serializer_class = ImagenVehiculoSerializer
    queryset = ImagenVehiculo.objects.all()

class AlquilerView(viewsets.ModelViewSet):
    serializer_class = AlquilerSerializer
    queryset = Alquiler.objects.all()


class ModeloFilter(generics.ListAPIView):
    serializer_class = ModeloSerializer

    def get_queryset(self):
        marca_id = self.kwargs['marca_id']
        return Modelo.objects.filter(marca__id = marca_id)
    
    
def get_vehiculo_choices(request):
    tipo_carroceria_choices = Vehicle.TIPO_CARROCERIA_CHOICES
    tipo_combustible_choices = Vehicle.TIPO_COMBUSTIBLE_CHOICES
    tipo_cambio_choices = Vehicle.TIPO_CAMBIO_CHOICES

    return JsonResponse({
        'tipo_carroceria': tipo_carroceria_choices,
        'tipo_combustible': tipo_combustible_choices,
        'tipo_cambio': tipo_cambio_choices,
    })


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if username == '':
        return Response('El nombre es obligatorio')
        #return Response({'error': 'Se requiere nombre de usuario y contraseña'},    
        #                status=status.HTTP_400_BAD_REQUEST)  
    elif email == '':
        return Response('El email es obligatorio')
    
    elif password == '':
        return Response('La contraseña es obligatoria')
       
    elif User.objects.filter(username=username).exists():
        return Response('Este nombre de usuario ya existe. Escoge uno distinto')
        #return Response({'error': 'El nombre de usuario ya existe'},
        #                status=status.HTTP_400_BAD_REQUEST)
    
    User.objects.create_user(username=username, password=password, email=email)

    return Response('Usuario registrado correctamente')



@api_view(['POST'])
def create_vehicle(request):
    print(request.data['vehiculo'])
    vehiculo_data = json.loads(request.data['vehiculo'])
    
    marca_id = vehiculo_data.get('marca_id')
    modelo_id = vehiculo_data.get('modelo_id')
    propietario_id = vehiculo_data.get('propietario_id')
    año = vehiculo_data.get('año')
    matricula = vehiculo_data.get('matricula')
    descripcion = vehiculo_data.get('descripcion')
    tipo_carroceria = vehiculo_data.get('tipo_carroceria')
    tipo_combustible = vehiculo_data.get('tipo_combustible')
    tipo_cambio = vehiculo_data.get('tipo_cambio')
    consumo = vehiculo_data.get('consumo')
    kilometraje = vehiculo_data.get('kilometraje')
    precio_por_hora = vehiculo_data.get('precio_por_hora')
    latitud = vehiculo_data.get('latitud')
    longitud = vehiculo_data.get('longitud')
    disponible = vehiculo_data.get('disponible')
    color = vehiculo_data.get('color')
    
    print(request.data)
    user = User.objects.get(pk = propietario_id)
    marca = Marca.objects.get(pk = marca_id)
    modelo = Modelo.objects.get(pk = modelo_id)

    vehiculo = Vehicle.objects.create(propietario=user, marca=marca, modelo=modelo, año=año, matricula=matricula,
                    descripcion=descripcion, tipo_carroceria=tipo_carroceria, tipo_combustible=tipo_combustible, tipo_cambio=tipo_cambio,
                    consumo=consumo, kilometraje=kilometraje, precio_por_hora=precio_por_hora, latitud=latitud, longitud=longitud,
                    disponible=disponible, color=color)

    # Procesar las imágenes asociadas al vehículo
    for imagen in request.FILES.getlist('imagen'): 
        print('DENTRO DEL FOOOOOOOOOOOOOOOR')
        print(imagen)
        # Crear una instancia de UploadedFile a partir de los datos binarios de la imagen
        archivo = ContentFile(imagen.read(), name=imagen.name)
        # Crear una instancia de ImagenVehiculo con el archivo
        ImagenVehiculo.objects.create(vehiculo=vehiculo, imagen=archivo)

    return Response({'mensaje': 'Vehículo creado con éxito'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_user_vehicles(request, id):
    try:
        # Filtrar los vehículos que pertenecen al usuario concreto
        vehiculos_usuario = Vehicle.objects.filter(propietario=id)
        
        # Serializar los vehículos encntrados junto con la ruta completa a sus imágenes
        serializer = VehicleSerializer(vehiculos_usuario, many=True, context={'request': request})
        
        # Retornar la lista de vehículos del usuario concreto
        return Response(serializer.data)
    except Vehicle.DoesNotExist:
        # Si no se encuentran vehículos para el usuario, devolver una respuesta vacía
        return Response([], status=404)
    
    

@api_view(['PUT'])
def update_vehicle_image(request, id):
    try:
        imagen = ImagenVehiculo.objects.get(pk=id)
    except ImagenVehiculo.DoesNotExist:
        return Response(status=404)

    if 'imagen' in request.FILES:
        imagen.imagen = request.FILES['imagen']
        imagen.save()
        
        # Serializar la imagen actualizada para devolverlo en la respuesta
        serializer = ImagenVehiculoSerializer(imagen)
        return Response(serializer.data)
    else:
        # Si no se proporcionó una imagen en la solicitud, retornar un error 400
        #return Response({'error': 'La imagen del vehículo no fue proporcionada'}, status=400)
        return Response('Imagen no proporcionada')


@api_view(['GET'])
def filtrar_vehiculos(request):
    vehiculos = Vehicle.objects.all()
    return Response('filtrando')



class UserDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # asumiendo que el usuario está autenticado y el token es válido
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'id': user.id,
        })
