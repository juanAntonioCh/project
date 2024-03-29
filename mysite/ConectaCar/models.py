from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Vehicle(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    make = models.CharField(max_length=50)  # Marca del vehículo, ej. Toyota, Ford
    model = models.CharField(max_length=50)  # Modelo del vehículo, ej. Corolla, Mustang
    year = models.IntegerField()  # Año del vehículo
    license_plate = models.CharField(max_length=20, unique=True)  # Placa única
    description = models.TextField(blank=True)  # Descripción adicional o notas
    is_available = models.BooleanField(default=True)  # Disponibilidad para alquilar

    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"


class Booking(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()  # Fecha de inicio del alquiler
    end_date = models.DateField()  # Fecha de fin del alquiler
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación de la reserva

    def __str__(self):
        return f"Reserva de {self.renter} para {self.vehicle} desde {self.start_date} hasta {self.end_date}"


class Review(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    comment = models.TextField()  # Comentario del usuario
    rating = models.IntegerField()  # Valoración numérica, ej. de 1 a 5
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación de la valoración

    def __str__(self):
        return f"Valoración de {self.author} para {self.vehicle}"
