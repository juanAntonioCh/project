from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'vehicles', views.VehicleView, 'vehicles')
router.register(r'marca', views.MarcaView, 'marca')
router.register(r'modelo', views.ModeloView, 'modelo')
router.register(r'imagenes', views.ImagenVehiculoView, 'imagenes')
router.register(r'alquiler', views.AlquilerViewSet, 'alquiler')
router.register(r'usuario', views.UserView, 'usuario')
#router.register(r'', views.VehicleView, 'vehicles')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register, name='register-user'),
    path('forgot-password/', views.forgot_password),
    path('reset-password-confirm/', views.reset_password_confirm, name='reset-password-confirm'),
    #path('reset-password-confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('vehicle-choices/', views.get_vehiculo_choices, name='vehicle-choices'),
    path('user-details/', views.UserDetailsView.as_view(), name='user-details'),
    path('modelos/<int:marca_id>/', views.ModeloFilter.as_view(), name='modelos-por-marca'),
    path('create-vehicle/', views.create_vehicle, name='create-vehicle'),
    path('vehicles/user/<int:id>/', views.get_user_vehicles, name='vehicles-user'),
    path('vehicle/image/update/<int:id>/', views.update_vehicle_image, name='image-update'),
    path('alquileres/propietario/', views.AlquileresPropietario.as_view(), name='alquileres-propietario'),
    path('alquileres/solicitante/', views.AlquileresSolicitante.as_view(), name='alquileres-solicitante'),
]
