from django.shortcuts import render
from rest_framework import viewsets
from .serializer import *
from .models import *

# Create your views here.
class VehicleView(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    vehiculos = Vehicle.objects.all()
