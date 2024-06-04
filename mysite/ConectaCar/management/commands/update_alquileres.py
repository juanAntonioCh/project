from django.core.management.base import BaseCommand
from django.utils import timezone
from ConectaCar.models import Alquiler

class Command(BaseCommand):
    help = 'Actualiza el estado de los alquileres basándose en las fechas de inicio y fin'

    def handle(self, *args, **kwargs):
        now = timezone.now()

        # Actualizar alquileres confirmados a activos
        confirmados_a_activos = Alquiler.objects.filter(estado='confirmado', fecha_inicio__lte=now)
        for alquiler in confirmados_a_activos:
            alquiler.estado = 'activo'
            alquiler.save()
            self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a activo'))

        # Actualizar alquileres activos a finalizados
        activos_a_finalizados = Alquiler.objects.filter(estado='activo', fecha_fin__lte=now)
        for alquiler in activos_a_finalizados:
            alquiler.estado = 'finalizado'
            alquiler.save()
            self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a finalizado'))
