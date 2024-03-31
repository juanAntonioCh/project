from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'ConectaCar', views.VehicleView, 'vehicles')
#router.register(r'', views.VehicleView, 'vehicles')

urlpatterns = [
    path('vehicles/', include(router.urls)),
    path('register/', views.register, name='register_user'),
]
