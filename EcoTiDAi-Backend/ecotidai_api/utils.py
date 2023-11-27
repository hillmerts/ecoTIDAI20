from datetime import datetime
import random
import geocoder
from django.db.models import Sum
from functools import reduce

import pandas as pd

def queryset_to_dataframe(queryset,columns,types):
      df = pd.DataFrame(list(queryset), columns=columns)
      for column, type in zip(columns,types):
            df[column] = df[column].astype(type)
      return df

def filtrar_fechas(queryset, params):
      
      if "start_date" in params:
            start_date = params["start_date"]
            queryset = queryset.filter(fecha__gte=datetime.date(start_date, "yyyy-MM-dd"))

      if  "end_date" in params:
            end_date = params["end_date"]
            queryset = queryset.filter(fecha__lte=datetime.date(end_date, "yyyy-MM-dd"))

      return queryset

def obtener_total_llantas(queryset):
      suma_llantas = queryset.aggregate(
            total_bicicleta=Sum("bicicleta"),
            total_motocicleta=Sum("motocicleta"),
            total_automovil13=Sum("automovil13"),
            total_automovil14=Sum("automovil14"),
            total_automovil15=Sum("automovil15"),
            total_camioneta16=Sum("camioneta16"),
            total_camioneta17=Sum("camioneta17"),
            total_camioneta18=Sum("camioneta18"),
            total_camioneta19=Sum("camioneta19"),
            total_especiales=Sum("especiales"),
        )

      return reduce(lambda x,y : x+y , suma_llantas.values())

def obtener_pqrs_pendientes(queryset):
      return queryset.filter(recoleccion=False).count()

def obtener_ubicaciones_distintas(queryset):
      return queryset.values('latitud', 'longitud').distinct().count()

def obtener_kilometros_recorridos(queryset):
      # Por hacer
      return random.randint(0, 10000)

def obtener_primera_fecha(queryset):
      return queryset.values('fecha').order_by('fecha')[0]['fecha']

def get_lat_log(direccion):
      return geocoder.osm(direccion+', Bogota, Colombia').latlng