# Generated by Django 4.2.7 on 2024-04-04 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ConectaCar', '0003_imagenvehiculo_marca_modelo_reserva_valoracion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reserva',
            name='fecha_fin',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='reserva',
            name='fecha_inicio',
            field=models.DateTimeField(),
        ),
    ]
