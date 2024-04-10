from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializer import *
from .models import *
import math

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
    print('hoola')
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
        return Response('El nombre de usuario ya existe')
        #return Response({'error': 'El nombre de usuario ya existe'},
        #                status=status.HTTP_400_BAD_REQUEST)
    
    User.objects.create_user(username=username, password=password, email=email)

    return Response('Usuario registrado correctamente')


def find_vehicles(request):
    user_lat = float(request.GET.get('lat'))
    user_long = float(request.GET.get('long'))
    radius = float(request.GET.get('radius', 10)) # Radio en kilómetros

    #def haversine(lon1, lat1, lon2, lat2):
        # Calcula la distancia en kilómetros entre dos puntos en la tierra.
        # Implementación del cálculo Haversine...

    vehicles = Vehicle.objects.all()
    vehicles_in_radius = [vehicle for vehicle in vehicles if haversine(user_long, user_lat, vehicle.longitud, vehicle.latitud) <= radius]

    # Serializa y retorna los vehículos en el radio
    # Esto es solo un esquema, necesitarás adaptarlo a tus necesidades
    return JsonResponse({"vehicles": vehicles_in_radius})


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
