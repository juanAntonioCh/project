from django.contrib import admin
from .models import *

admin.site.register(Vehicle)
admin.site.register(Marca)
admin.site.register(Modelo)
admin.site.register(ImagenVehiculo)
admin.site.register(Alquiler)
admin.site.register(Valoracion)
admin.site.register(Notificacion)
admin.site.register(UserProfile)