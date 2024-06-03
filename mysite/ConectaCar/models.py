from django.db import models
from django.contrib.auth.models import User


class Marca(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Modelo(models.Model):
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name='modelos')
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Vehicle(models.Model):
    propietario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='vehiculos')
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, null=True)
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE, null=True)
    año = models.IntegerField(null=True, blank=True)
    matricula = models.CharField(max_length=20, unique=True)

    TIPO_COMBUSTIBLE_CHOICES = [
        ('gasolina', 'Gasolina'),
        ('diesel', 'Diésel'),
        ('electrico', 'Eléctrico'),
        ('hibrido', 'Híbrido'),
    ]
    
    TIPO_CAMBIO_CHOICES = [
        ('manual', 'Manual'),
        ('automatico', 'Automático'),
    ]

    TIPO_CARROCERIA_CHOICES = [
        ('turismo', 'Turismo'),
        ('monovolumen', 'Monovolumen'),
        ('suv', 'SUV y 4x4'),
        ('deportivo', 'Deportivo'),
        ('pickup', 'Pickup'),
        ('no_especificado', 'No Especificado'),
    ]

    COLOR_CHOICES = [
        ('rojo', 'Rojo'),
        ('verde', 'Verde'),
        ('azul', 'Azul'),
        ('negro', 'Negro'),
        ('blanco', 'Blanco'),
        ('gris', 'Gris'),
        ('amarillo', 'Amarillo'),
        ('naranja', 'Naranja'),
        ('rosa', 'Rosa'),
        ('morado', 'Morado'),
        ('otro', 'Otro'),
    ]

    color = models.CharField(
        max_length=10,
        choices=COLOR_CHOICES,
        default='otro',
        help_text="Color del vehículo."
    )

    tipo_carroceria = models.CharField(
        max_length=20,
        choices=TIPO_CARROCERIA_CHOICES,
        default='no_especificado',  
        blank=True,
        null=True,   
        help_text="Tipo de carrocería del vehículo."
    )
    
    tipo_combustible = models.CharField(
        max_length=10,
        choices=TIPO_COMBUSTIBLE_CHOICES,
        default='gasolina',
    )
    
    consumo = models.DecimalField(max_digits=4,null=True, blank=True, decimal_places=2, help_text="Consumo de combustible del vehículo (litros/100 km).")
    autonomia = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2,help_text="Autonomía estimada del vehículo en kilómetros.")
    kilometraje = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=2, help_text="Kilómetros que ha recorrido el vehículo.")
    numero_plazas = models.PositiveIntegerField(verbose_name="Número de plazas", default=5)
    #potencia = models.IntegerField(help_text="Número de caballos de fuerza (CV)", null=True)

    tipo_cambio = models.CharField(
        max_length=10,
        choices=TIPO_CAMBIO_CHOICES,
        default='manual',
    )

    descripcion = models.TextField(null=True, blank=True)
    precio_por_hora = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    disponible = models.BooleanField(default=True)
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f'{self.marca} {self.modelo} ({self.año})'


class ImagenVehiculo(models.Model):
    vehiculo = models.ForeignKey(Vehicle, related_name='imagenes', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='imagenes_vehiculos/')

    def __str__(self):
        return f"Imagen de {self.vehiculo.marca} {self.vehiculo.modelo}"

    

class Alquiler(models.Model):
    solicitante = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reservas_cliente')
    propietario = models.ForeignKey(User, related_name='propiedades', null=True, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, related_name='reservas')
    estado = models.CharField(max_length=20, choices=[('pendiente', 'Pendiente'), 
                                                    ('confirmado', 'Confirmado'), 
                                                    ('activo', 'Activo'),
                                                    ('rechazado', 'Rechazado')], default='pendiente')
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    fecha_reserva = models.DateTimeField(auto_now_add=True, null=True)
    precio_total = models.DecimalField(max_digits=8, decimal_places=2)
    mensaje = models.TextField(blank=True)  # Campo opcional para el mensaje del solicitante al propietario
    
    def __str__(self):
        return f'Alquiler de {self.vehiculo} por {self.solicitante}'
        

class Valoracion(models.Model):
    vehiculo = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='valoraciones')
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    comentario = models.TextField()
    valoracion = models.PositiveIntegerField() 
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Valoración de {self.autor} sobre {self.vehiculo}'
