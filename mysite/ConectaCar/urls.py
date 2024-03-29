from django.urls import path, include
from rest_framework import routers
from ConectaCar import views

router = routers.DefaultRouter()
router.register(r'ConectaCar', views.VehicleView, 'vehicles')

urlpatterns = [
    path('vehicles/', include(router.urls))
]
