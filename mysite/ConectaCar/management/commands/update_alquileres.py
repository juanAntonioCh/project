from django.core.management.base import BaseCommand
from django.utils import timezone
#from datetime import datetime
from datetime import timedelta
from ConectaCar.models import Alquiler

class Command(BaseCommand):
    help = 'Actualiza el estado de los alquileres basándose en las fechas de inicio y fin'

    def handle(self, *args, **kwargs):
        # current_dateTime = datetime.now()
        # print(current_dateTime)
        #now = timezone.now()
        now_adjusted = timezone.now() + timedelta(hours=2)
        print('Fecha actual', now_adjusted)

        # Actualizar alquileres confirmados a activos
        confirmados_a_activos = Alquiler.objects.filter(estado='confirmado', fecha_inicio__lte=now_adjusted)
        print('Alquileres confirmados cuya fecha de inicio ha llegado', confirmados_a_activos)
        for alquiler in confirmados_a_activos:
            print('Fecha de inicio',alquiler.fecha_inicio)
            alquiler.estado = 'activo'
            alquiler.save()
            self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a activo'))

        # Actualizar alquileres activos a finalizados
        activos_a_finalizados = Alquiler.objects.filter(estado='activo', fecha_fin__lte=now_adjusted)
        print('Alquileres activos cuya fecha de fin ha llegado', activos_a_finalizados)
        for alquiler in activos_a_finalizados:
            print('Fecha de fin', alquiler.fecha_fin)
            alquiler.estado = 'finalizado'
            alquiler.save()
            self.stdout.write(self.style.SUCCESS(f'Alquiler {alquiler.id} actualizado a finalizado'))
