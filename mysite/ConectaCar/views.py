from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import status
import json
from django.core.files.base import ContentFile
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from django.http import JsonResponse
from .serializer import *
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.forms import SetPasswordForm
from rest_framework.generics import ListAPIView
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.views import View
from django.urls import reverse_lazy
from django.utils import timezone
from django.contrib.auth import login
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from .models import *

# Create your views here.
class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

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


class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        solicitante = request.user
        vehiculo_id = request.data.get('vehiculo')

        # Comprobar si ya existe una reserva pendiente o confirmada para este vehículo y solicitante
        if Alquiler.objects.filter(solicitante=solicitante, vehiculo_id=vehiculo_id, estado__in=['pendiente', 'confirmado']).exists():
            return Response(
                {'detail': 'Ya tienes una reserva pendiente o confirmada para este vehículo.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        alquiler = self.get_object()
        if alquiler.propietario != request.user:
            return Response({'error': 'No tienes permiso para confirmar esta reserva.'}, status=403)
        alquiler.estado = 'confirmado'
        #alquiler.fecha_confirmacion = timezone.now()
        alquiler.save()

        return Response({'status': 'reserva confirmada'})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        alquiler = self.get_object()
        if alquiler.propietario != request.user:
            return Response({'error': 'No tienes permiso para rechazar esta reserva.'}, status=403)
        alquiler.estado = 'rechazado'
        alquiler.save()
        return Response({'status': 'reserva rechazada'})
    

class AlquileresPropietario(ListAPIView):
    serializer_class = AlquilerSerializer

    def get_queryset(self):
        propietario = self.request.user
        vehiculos_propios = propietario.vehiculos.all()
        return Alquiler.objects.filter(vehiculo__in=vehiculos_propios)
    

class AlquileresSolicitante(ListAPIView):
    serializer_class = AlquilerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        solicitante = self.request.user
        return Alquiler.objects.filter(solicitante=solicitante)



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
        return Response('El nombre de usuario ya existe')
        #return Response({'error': 'El nombre de usuario ya existe'},
        #                status=status.HTTP_400_BAD_REQUEST)
    
    User.objects.create_user(username=username, password=password, email=email)

    return Response('Usuario registrado correctamente')


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        #return Response('Mal')
        return Response('No user associated with this email', status=400)

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    domain = current_site.domain
    protocol = 'https' if request.is_secure() else 'http'
    
    # Construct the password reset URL
    reset_url = f"https://6c4143d1-64a1-4e95-98b6-c1f27c54e5c1.e1-eu-north-azure.choreoapps.dev/reset-password-confirm/{uid}/{token}"

    # Render the email template with context
    email_subject = 'Solicitud de cambio de contraseña'
    email_body = render_to_string('password_reset_email.html', {
        'user': user,
        'reset_url': reset_url,
        'domain': domain,
    })

    #print(user.email)

    email = EmailMultiAlternatives(
        email_subject,
        email_body,
        '1817826@alu.murciaeduca.es',
        [user.email]
    )
    email.attach_alternative(email_body, "text/html")
    email.send()


    return Response('Email sent', status=200)
    #return Response('Bien')

@api_view(['POST'])
def reset_password_confirm(request):
    uidb64 = request.data.get('uidb64')
    token = request.data.get('token')
    new_password = request.data.get('password')

    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Password has been reset'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


""" class PasswordResetConfirmView(View):
    template_name = 'password_reset_confirm.html'

    def get(self, request, uidb64=None, token=None):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            form = SetPasswordForm(user)
            return render(request, self.template_name, {'form': form, 'validlink': True})
        else:
            return render(request, self.template_name, {'validlink': False})

    def post(self, request, uidb64=None, token=None):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            form = SetPasswordForm(user, request.POST)
            if form.is_valid():
                form.save()
                login(request, user)
                return redirect(reverse_lazy('password_reset_complete'))
            else:
                return render(request, self.template_name, {'form': form, 'validlink': True})
        else:
            return render(request, self.template_name, {'validlink': False}) """
    


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
    autonomia = vehiculo_data.get('autonomia')
    numero_plazas = vehiculo_data.get('numero_plazas')
    color = vehiculo_data.get('color')
    
    print(request.data)
    user = User.objects.get(pk = propietario_id)
    marca = Marca.objects.get(pk = marca_id)
    modelo = Modelo.objects.get(pk = modelo_id)

    vehiculo = Vehicle.objects.create(propietario=user, marca=marca, modelo=modelo, año=año, matricula=matricula,
                    descripcion=descripcion, tipo_carroceria=tipo_carroceria, tipo_combustible=tipo_combustible, tipo_cambio=tipo_cambio,
                    consumo=consumo, kilometraje=kilometraje, precio_por_hora=precio_por_hora, latitud=latitud, longitud=longitud,
                    disponible=disponible, color=color, numero_plazas=numero_plazas, autonomia=autonomia)

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
