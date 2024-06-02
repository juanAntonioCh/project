# Generated by Django 4.2.11 on 2024-06-02 16:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ConectaCar', '0009_mensaje'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_inicio', models.DateTimeField()),
                ('fecha_fin', models.DateTimeField()),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('confirmada', 'Confirmada'), ('rechazada', 'Rechazada')], default='pendiente', max_length=20)),
                ('fecha_solicitud', models.DateTimeField(auto_now_add=True)),
                ('fecha_confirmacion', models.DateTimeField(blank=True, null=True)),
                ('mensaje', models.TextField(blank=True)),
                ('propietario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='propiedades', to=settings.AUTH_USER_MODEL)),
                ('solicitante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservas', to=settings.AUTH_USER_MODEL)),
                ('vehiculo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ConectaCar.vehicle')),
            ],
        ),
        migrations.RemoveField(
            model_name='alquiler',
            name='fecha_reserva',
        ),
        migrations.DeleteModel(
            name='Mensaje',
        ),
        migrations.AddField(
            model_name='alquiler',
            name='reserva',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='ConectaCar.reserva'),
        ),
    ]
