from django.db import models, transaction
from django.db.models import F
from django.dispatch import receiver
from django.db.models.signals import post_save
import datetime
from .utils import get_lat_log

# Create your models here.

class PuntoRecoleccionManager(models.Manager):
    def get_queryset(self):
        """Overrides the models.Manager method"""
        qs = super(PuntoRecoleccionManager, self).get_queryset().annotate(
            total_llantas=F("bicicleta") + F("motocicleta") + F("automovil13") +
            F("automovil14") + F("automovil15") + F("camioneta16") + F("camioneta17") +
            F("camioneta18") + F("camioneta19") + F("especiales")
            )
        return qs

class PuntoRecoleccion(models.Model):
    LOCALIDADES_CHOICES = [
        ("Usaquén", "Usaquén"),
        ("Chapinero", "Chapinero"),
        ("Santa Fe", "Santa Fe"),
        ("San Cristóbal", "San Cristóbal"),
        ("Usme", "Usme"),
        ("Tunjuelito", "Tunjuelito"),
        ("Bosa", "Bosa"),
        ("Kennedy", "Kennedy"),
        ("Fontibón", "Fontibón"),
        ("Engativá", "Engativá"),
        ("Suba", "Suba"),
        ("Barrios Unidos", "Barrios Unidos"),
        ("Teusaquillo", "Teusaquillo"),
        ("Los Mártires", "Los Mártires"),
        ("Antonio Nariño", "Antonio Nariño"),
        ("Puente Aranda", "Puente Aranda"),
        ("La Candelaria", "La Candelaria"),
        ("Rafael Uribe Uribe", "Rafael Uribe Uribe"),
        ("Ciudad Bolívar", "Ciudad Bolívar"),
    ]

    fecha = models.DateField(default=datetime.date.today)
    localidad = models.CharField(max_length=100, choices=LOCALIDADES_CHOICES, null=False)
    direccion = models.CharField(max_length=100, null=False)
    latitud = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=7)
    longitud = models.DecimalField(null=True, blank=True, max_digits=10, decimal_places=7)
    bicicleta = models.PositiveIntegerField(default=0)
    motocicleta = models.PositiveIntegerField(default=0)
    automovil13 = models.PositiveIntegerField(default=0)
    automovil14 = models.PositiveIntegerField(default=0)
    automovil15 = models.PositiveIntegerField(default=0)
    camioneta16 = models.PositiveIntegerField(default=0)
    camioneta17 = models.PositiveIntegerField(default=0)
    camioneta18 = models.PositiveIntegerField(default=0)
    camioneta19 = models.PositiveIntegerField(default=0)
    especiales = models.PositiveIntegerField(default=0)
    recoleccion = models.BooleanField(default=False)

    objects = PuntoRecoleccionManager()

    def __str__(self):
        return f"{self.fecha} - {self.localidad} - {self.direccion}"
    
    

# method for updating
@receiver(post_save, sender=PuntoRecoleccion, dispatch_uid="update_latlog_puntorecoleccion")
def update_latlog(sender, instance, created, **kwargs):
    if created:
    
        latlog = get_lat_log(instance.direccion)
        if latlog is None:
            transaction.rollback()
            raise Exception("La direccion no pudo ser localizada")    
        instance.latitud = latlog[0]
        instance.longitud = latlog[1]
        post_save.disconnect(receiver=update_latlog, sender=PuntoRecoleccion, dispatch_uid="update_latlog_puntorecoleccion")
        instance.save()
        post_save.connect(receiver=update_latlog, sender=PuntoRecoleccion, dispatch_uid="update_latlog_puntorecoleccion")
        
