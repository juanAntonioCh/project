# Generated by Django 4.2.7 on 2024-04-01 22:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ConectaCar', '0002_remove_vehicle_owner'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImagenVehiculo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='imagenes_vehiculos/')),
            ],
        ),
        migrations.CreateModel(
            name='Marca',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Modelo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('marca', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modelos', to='ConectaCar.marca')),
            ],
        ),
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_inicio', models.DateField()),
                ('fecha_fin', models.DateField()),
                ('precio_total', models.DecimalField(decimal_places=2, max_digits=8)),
                ('fecha_reserva', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reservas_cliente', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Valoracion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.TextField()),
                ('valoracion', models.PositiveIntegerField()),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('autor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='review',
            name='author',
        ),
        migrations.RemoveField(
            model_name='review',
            name='vehicle',
        ),
        migrations.RenameField(
            model_name='vehicle',
            old_name='is_available',
            new_name='disponible',
        ),
        migrations.RenameField(
            model_name='vehicle',
            old_name='license_plate',
            new_name='matricula',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='description',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='make',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='model',
        ),
        migrations.RemoveField(
            model_name='vehicle',
            name='year',
        ),
        migrations.AddField(
            model_name='vehicle',
            name='año',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='color',
            field=models.CharField(choices=[('rojo', 'Rojo'), ('verde', 'Verde'), ('azul', 'Azul'), ('negro', 'Negro'), ('blanco', 'Blanco'), ('gris', 'Gris'), ('amarillo', 'Amarillo'), ('naranja', 'Naranja'), ('rosa', 'Rosa'), ('morado', 'Morado'), ('otro', 'Otro')], default='otro', help_text='Color del vehículo.', max_length=10),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='consumo',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Consumo de combustible del vehículo (litros/100 km).', max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='descripcion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='kilometraje',
            field=models.IntegerField(blank=True, help_text='Kilómetros que ha recorrido el vehículo.', null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='latitud',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='longitud',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='precio_por_dia',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='propietario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='vehiculos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='tipo_cambio',
            field=models.CharField(choices=[('manual', 'Manual'), ('automatico', 'Automático')], default='manual', max_length=10),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='tipo_carroceria',
            field=models.CharField(blank=True, choices=[('turismo', 'Turismo'), ('monovolumen', 'Monovolumen'), ('suv', 'SUV y 4x4'), ('deportivo', 'Deportivo'), ('pickup', 'Pickup'), ('no_especificado', 'No Especificado')], default='no_especificado', help_text='Tipo de carrocería del vehículo.', max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='tipo_combustible',
            field=models.CharField(choices=[('gasolina', 'Gasolina'), ('diesel', 'Diésel'), ('electrico', 'Eléctrico'), ('hibrido', 'Híbrido')], default='gasolina', max_length=10),
        ),
        migrations.DeleteModel(
            name='Booking',
        ),
        migrations.DeleteModel(
            name='Review',
        ),
        migrations.AddField(
            model_name='valoracion',
            name='vehiculo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='valoraciones', to='ConectaCar.vehicle'),
        ),
        migrations.AddField(
            model_name='reserva',
            name='vehiculo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reservas', to='ConectaCar.vehicle'),
        ),
        migrations.AddField(
            model_name='imagenvehiculo',
            name='vehiculo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imagenes', to='ConectaCar.vehicle'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='marca',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ConectaCar.marca'),
        ),
        migrations.AddField(
            model_name='vehicle',
            name='modelo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ConectaCar.modelo'),
        ),
    ]
