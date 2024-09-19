from rest_framework import viewsets
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework import status
import json
import os
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
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
import uuid
from mailjet_rest import Client
from django.conf import settings
from datetime import timedelta
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


@api_view(['GET'])
def ejecutar_actualizacion(request):
    update_alquiler()
    return JsonResponse({'status': 'success'})


#funcion para actualizar el estado de los alquileres en funcion de las fechas de inicio y fin de forma automatica,
#sin que el propietario del vehiculo tenga que realizar ninguna accion.
def update_alquiler():
    # current_dateTime = datetime.now()
    # print(current_dateTime)
    #now = timezone.now()
    now_adjusted = timezone.now() + timedelta(hours=2)
    print('*****************')
    print('\nFecha actual', now_adjusted)

    # Actualizar alquileres pendientes cuya fecha de inicio haya pasado y todavía no se hayan aceptado o rechazado.
    pendientes_a_rechazados = Alquiler.objects.filter(estado='pendiente', fecha_inicio__lte=now_adjusted)
    print('\nAlquileres pendientes cuya fecha de inicio ha llegado y todavía no se han aceptado ni rechazado', pendientes_a_rechazados)
    for alquiler in pendientes_a_rechazados:
        print('Fecha de inicio',alquiler.fecha_inicio)
        alquiler.estado = 'rechazado'
        alquiler.save()

        vehiculo = alquiler.vehiculo
        Notificacion.objects.create(
            usuario=alquiler.solicitante,
            mensaje=f'Tu solicitud de alquiler de {vehiculo.marca} {vehiculo.modelo} ha sido rechazada debido a que ha expirado la fecha de inicio y el propietario no ha confirmado la solicitud'
        )
        #self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a activo'))
        print(f'Alquiler {alquiler.id} actualizado a rechazado')

    # Actualizar alquileres confirmados a activos
    confirmados_a_activos = Alquiler.objects.filter(estado='confirmado', fecha_inicio__lte=now_adjusted)
    print('\nAlquileres confirmados cuya fecha de inicio ha llegado', confirmados_a_activos)
    for alquiler in confirmados_a_activos:
        print('Fecha de inicio (UTC):', alquiler.fecha_inicio)
        print('Fecha de inicio (local):', alquiler.fecha_inicio.astimezone(timezone.get_current_timezone()))
        alquiler.estado = 'activo'
        alquiler.save()

        vehiculo = alquiler.vehiculo
        Notificacion.objects.create(
            usuario=alquiler.solicitante,
            mensaje=f'Tu alquiler de {vehiculo.marca} {vehiculo.modelo} está activo.'
        )
        #self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a activo'))
        print(f'Alquiler {alquiler.id} actualizado a activo')

    # Actualizar alquileres activos a finalizados
    activos_a_finalizados = Alquiler.objects.filter(estado='activo', fecha_fin__lte=now_adjusted)
    print('Alquileres activos cuya fecha de fin ha llegado', activos_a_finalizados)
    for alquiler in activos_a_finalizados:
        print('Fecha de fin', alquiler.fecha_fin)
        alquiler.estado = 'finalizado'
        alquiler.save()

        vehiculo = alquiler.vehiculo
        Notificacion.objects.create(
            usuario=alquiler.solicitante,
            mensaje=f'Tu alquiler de {vehiculo.marca} {vehiculo.modelo} ha finalizado.'
        )
        #self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a finalizado'))
        print(f'Alquiler {alquiler.id} actualizado a finalizado')



class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        solicitante = request.user
        vehiculo_id = request.data.get('vehiculo')
        fecha_inicio = request.data.get('fecha_inicio')
        fecha_fin = request.data.get('fecha_fin')

        # Comprobar si ya existe una reserva pendiente o confirmada para este vehículo y solicitante
        if Alquiler.objects.filter(solicitante=solicitante, vehiculo_id=vehiculo_id, estado__in=['pendiente', 'confirmado', 'activo']).exists():
            return Response(
                {'detail': 'Ya tienes una reserva pendiente, confirmada o activa para este vehículo.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
         # Comprobar si existe algún alquiler confirmado o activo que se superponga con las fechas solicitadas
        if Alquiler.objects.filter(
            vehiculo_id=vehiculo_id,
            estado__in=['confirmado', 'activo'],
            fecha_inicio__lt=fecha_fin,
            fecha_fin__gt=fecha_inicio
        ).exists():
            return Response(
                {'detail': 'El vehículo ya está reservado o alquilado para las fechas seleccionadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response = super().create(request, *args, **kwargs)

        # Crear la notificación del alquiler para el propietario.
        vehiculo = Vehicle.objects.get(id=vehiculo_id)
        propietario = vehiculo.propietario
        Notificacion.objects.create(
            usuario=propietario,
            mensaje=f'Se ha solicitado un alquiler para tu vehículo {vehiculo.marca} {vehiculo.modelo}.'
        )

        return response

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        alquiler = self.get_object()
        if alquiler.propietario != request.user:
            return Response({'error': 'No tienes permiso para confirmar esta reserva.'}, status=403)

        #Comprobar que la fecha de inicio del alquiler no haya pasado, en ese caso la solicitud se rechazaria
        if alquiler.fecha_inicio <= timezone.now():
            alquiler.estado = 'rechazado'
            alquiler.save()
            return Response({'error': 'No puedes confirmar una reserva cuya fecha de inicio ya ha pasado.'}, status=status.HTTP_400_BAD_REQUEST)

        alquiler.estado = 'confirmado'       
        alquiler.save()
        #alquiler.fecha_confirmacion = timezone.now()

        # Rechazar otras reservas que se solapan en fechas con esta
        alquileres_incompatibles = Alquiler.objects.filter(
            vehiculo=alquiler.vehiculo,
            estado='pendiente',
            fecha_inicio__lt=alquiler.fecha_fin,
            fecha_fin__gt=alquiler.fecha_inicio
        ).exclude(id=alquiler.id)

        for alquiler in alquileres_incompatibles:
            alquiler.estado = 'rechazado'
            alquiler.save()

        #creamos una notificacion para el solicitante cuando su solicitud de alquiler sea aceptada por el propietario. 
        vehiculo = alquiler.vehiculo
        Notificacion.objects.create(
            usuario=alquiler.solicitante,
            mensaje=f'Tu solicitud de alquiler de {vehiculo.marca} {vehiculo.modelo} ha sido aceptada'
        )

        #Despues de confirmar el alquiler y rechazar otros alquileres que coincidan en fechas si existen, devolvemos los alquileres
        #que siguen pendientes para actualizar la lista en el frontend :)
        alquileres_pendientes = Alquiler.objects.filter(propietario=request.user, estado='pendiente')
        serializer = self.get_serializer(alquileres_pendientes, many=True)
        return Response(serializer.data)
        #return Response({'status': 'reserva confirmada'})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        alquiler = self.get_object()
        if alquiler.propietario != request.user:
            return Response({'error': 'No tienes permiso para rechazar esta reserva.'}, status=403)
        alquiler.estado = 'rechazado'
        alquiler.save()

        #creamos una notificacion para el solicitante cuando su solicitud de alquiler sea rechazada por el propietario. 
        vehiculo = alquiler.vehiculo
        Notificacion.objects.create(
            usuario=alquiler.solicitante,
            mensaje=f'Tu solicitud de alquiler de {vehiculo.marca} {vehiculo.modelo} ha sido rechazada'
        )

        return Response({'status': 'reserva rechazada'})
    

class AlquileresPropietario(ListAPIView):
    serializer_class = AlquilerSerializer

    def get_queryset(self):
        update_alquiler()
        propietario = self.request.user
        estado = self.request.query_params.get('estado', None)
        vehiculos_propios = propietario.vehiculos.all()
        queryset = Alquiler.objects.filter(vehiculo__in=vehiculos_propios)

        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset
    

class AlquileresSolicitante(ListAPIView):
    serializer_class = AlquilerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        update_alquiler()
        solicitante = self.request.user
        estado = self.request.query_params.get('estado', None)
        queryset = Alquiler.objects.filter(solicitante=solicitante)

        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset


class NotificacionList(generics.ListAPIView):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user, leido=False)
    

class MarcarNotificacionLeida(generics.UpdateAPIView):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user, leido=False)

    def perform_update(self, serializer):
        serializer.instance.leido = True
        serializer.save()


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



def send_verification_email(user, token):
    verification_link = f'http://127.0.0.1:5173/verify/?token={token}'
    api_key = 'ebfe7b9b592fb77f0eb5615a351c7e44'
    api_secret = '60507f05e06d8af8ce2894d096036f8f'
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')
    #verification_link = f'https://conectacar.ne.choreoapps.dev/verify/?token={token}'
    
    email_body = render_to_string('email_verification.html', {
        'user': user,
        'verification_link': verification_link,
    })
    
    subject = 'Verifica tu cuenta en ConectaCar'
    
        # Configurar el mensaje
    data = {
        'Messages': [
            {
                "From": {
                    "Email": settings.DEFAULT_FROM_EMAIL,
                    "Name": "ConectaCar"
                },
                "To": [
                    {
                        "Email": user.email,
                        "Name": user.username
                    }
                ],
                "Subject": subject,
                "TextPart": "Por favor, verifica tu cuenta en ConectaCar.",
                "HTMLPart": email_body,
            }
        ]
    }

    # Enviar el correo
    result = mailjet.send.create(data=data)
    
    # Manejar posibles errores en la respuesta de Mailjet
    if result.status_code != 200:
        print(f"Error enviando email: {result.status_code} {result.json()}")




def verify_login(request, username):
    user = User.objects.get(username = username)
    user_profile = UserProfile.objects.get(user = user)

    #print (user_profile)

    if user_profile.is_verified:
        return JsonResponse({'message': 'Usuario verificado.'}, status=200)
    else:
        return JsonResponse({'error': 'Cuenta no verificada. Verifica tu cuenta mediante el enlace enviado a tu correo.'}, status=400)
    


def verify_email(request):
    token = request.GET.get('token')  # Captura el token desde la URL
    print(token)
    if not token:
        return JsonResponse({'error': 'Token de verificación no proporcionado.'}, status=400)

    try:
        # Busca el perfil de usuario con el token de verificación proporcionado
        user_profile = get_object_or_404(UserProfile, verification_token=token)

        # Marca la cuenta como verificada
        user_profile.is_verified = True
        #user_profile.verification_token = None  #Eliminar el token después de verificar
        user_profile.save()

        return JsonResponse({'message': 'Correo verificado con éxito.'}, status=200)

    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'Token de verificación no válido o ya utilizado.'}, status=400)
    

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

    elif User.objects.filter(email = email).exists():
        return Response('Ya existe un usuario registrado con este correo')
    
    user = User.objects.create_user(username=username, password=password, email=email)

    user_profile = user.userprofile
    print(user_profile)
    token = user_profile.verification_token
    print(token)

    send_verification_email(user, token)

    return Response('Usuario registrado correctamente')


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    
    # Comprobar si el usuario existe
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response('No user associated with this email', status=400)

    # Generar token y URL de restablecimiento de contraseña
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    current_site = get_current_site(request)
    domain = current_site.domain
    protocol = 'https' if request.is_secure() else 'http'

    reset_url = f"http://127.0.0.1:5173/reset-password-confirm/{uid}/{token}"
    #reset_url = f"https://conectacar.ne.choreoapps.dev/reset-password-confirm/{uid}/{token}"

    # Renderizar el cuerpo del email con el template HTML
    email_subject = 'Solicitud de cambio de contraseña'
    email_body = render_to_string('password_reset_email.html', {
        'user': user,
        'reset_url': reset_url,
        'domain': domain,
    })

    # Configurar la API de Mailjet
    api_key = settings.EMAIL_HOST_USER
    api_secret = settings.EMAIL_HOST_PASSWORD

    mailjet = Client(auth=(api_key, api_secret), version='v3.1')

    # Crear el cuerpo del mensaje en Mailjet
    data = {
        'Messages': [
            {
                "From": {
                    "Email": settings.DEFAULT_FROM_EMAIL,
                    "Name": "ConectaCar"
                },
                "To": [
                    {
                        "Email": user.email,
                        "Name": user.username
                    }
                ],
                "Subject": email_subject,
                "HTMLPart": email_body
            }
        ]
    }

    # Enviar el email mediante Mailjet
    result = mailjet.send.create(data=data)

    # Comprobar si el envío del email fue exitoso
    if result.status_code == 200:
        return Response('Email sent', status=200)
    else:
        return Response(f"Failed to send email: {result.json()}", status=500)



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

    

@api_view(['POST'])
def create_vehicle(request):
    #print(request.data['vehiculo'])
    vehiculo_data = json.loads(request.data['vehiculo'])
    
    marca_id = vehiculo_data.get('marca_id')
    modelo_id = vehiculo_data.get('modelo_id')
    propietario_id = vehiculo_data.get('propietario_id')
    año = vehiculo_data.get('año')
    matricula = vehiculo_data.get('matricula')

    if Vehicle.objects.filter(matricula=matricula).exists():
        return Response({'error': f'Ya existe un vehículo con la matrícula {matricula}'}, status=status.HTTP_400_BAD_REQUEST)
    
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
    
    #print(request.data)
    user = User.objects.get(pk = propietario_id)
    marca = Marca.objects.get(pk = marca_id)
    modelo = Modelo.objects.get(pk = modelo_id)

    vehiculo = Vehicle.objects.create(propietario=user, marca=marca, modelo=modelo, año=año, matricula=matricula,
                    descripcion=descripcion, tipo_carroceria=tipo_carroceria, tipo_combustible=tipo_combustible, tipo_cambio=tipo_cambio,
                    consumo=consumo, kilometraje=kilometraje, precio_por_hora=precio_por_hora, latitud=latitud, longitud=longitud,
                    disponible=disponible, color=color, numero_plazas=numero_plazas, autonomia=autonomia)

    # Procesar las imágenes asociadas al vehículo
    for imagen in request.FILES.getlist('imagen'): 
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



class UserDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'id': user.id,
        })
