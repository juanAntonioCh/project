from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'vehicles', views.VehicleView, 'vehicles')
router.register(r'marca', views.MarcaView, 'marca')
router.register(r'modelo', views.ModeloView, 'modelo')
router.register(r'imagenes', views.ImagenVehiculoView, 'imagenes')
#router.register(r'', views.VehicleView, 'vehicles')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register, name='register_user'),
    path('vehicle-choices/', views.get_vehiculo_choices, name='vehiculo-choices'),
    path('user-details/', views.UserDetailsView.as_view(), name='user-details'),
    path('modelos/<int:marca_id>/', views.ModeloFilter.as_view(), name='modelos-por-marca'),
]
