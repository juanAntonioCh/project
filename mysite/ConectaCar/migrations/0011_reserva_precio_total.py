# Generated by Django 4.2.11 on 2024-06-03 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ConectaCar', '0010_reserva_remove_alquiler_fecha_reserva_delete_mensaje_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reserva',
            name='precio_total',
            field=models.DecimalField(decimal_places=2, max_digits=8, null=True),
        ),
    ]
