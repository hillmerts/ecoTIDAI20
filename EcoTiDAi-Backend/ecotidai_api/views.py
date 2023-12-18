from datetime import datetime
import warnings
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import PuntoRecoleccion
from .serializers import PuntoRecoleccionSerializer
from .utils import obtener_kilometros_recorridos
from .utils import obtener_pqrs_pendientes
from .utils import obtener_total_llantas
from .utils import obtener_ubicaciones_distintas
from .utils import obtener_primera_fecha
from .utils import filtrar_fechas
from .utils import  queryset_to_dataframe
from route_optimization.route_optimization import get_route


class PuntoRecoleccionViewSet(viewsets.ModelViewSet):
    
    """
    A viewset that provides the standard actions
    """
    queryset = PuntoRecoleccion.objects.all()
    serializer_class = PuntoRecoleccionSerializer
    permission_classes = [AllowAny]

    @action(detail=False)
    def obtener_consolidados(self, request):
        queryset = self.get_queryset()

        queryset = filtrar_fechas(queryset, request.query_params)  

        response = {
            "total_llantas": obtener_total_llantas(queryset),
            "prqs_pendientes": obtener_pqrs_pendientes(queryset),
            "ubicaciones_atendidas": obtener_ubicaciones_distintas(queryset),
            "kilometros_recorridos": obtener_kilometros_recorridos(queryset),
            "primera_fecha": obtener_primera_fecha(self.get_queryset())
        }
        
        return Response(response)


    @action(detail=False)
    def obtener_puntos(self, request):

        queryset = self.get_queryset()
        recoleccion = request.query_params['tipo'] == "historico"
        if (recoleccion):
            queryset = filtrar_fechas(queryset, request.query_params)
            puntos = queryset.filter(recoleccion=True)
            
        else:
            puntos = queryset.filter(Q(recoleccion=False)|Q(fecha=datetime.today()))
        
        if recoleccion:
            serializer = self.get_serializer(puntos, many=True, fields=['direccion', 'latitud', 'longitud'])
        else:
            serializer = self.get_serializer(puntos, many=True)

        return Response(serializer.data)


    @action(detail=False, methods=['post'])
    def agregar_punto(self, request):
        try:
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                serializer.save()


            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as ex:
            transaction.rollback()
            return Response(ex.args, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['post'])
    def recolectar(self, request, pk):
        punto = get_object_or_404(self.queryset, pk=pk)
        punto.recoleccion = True
        punto.save()
        mensaje = {"recoleccion": True}
        return Response(mensaje, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'])
    def obtener_ruta(self, request):

        columns = ['pk', 'latitud', 'longitud', 'total_llantas']
        types = [int, float, float, int]
        queryset = self.get_queryset().filter(
            recoleccion=False
            ).values('pk', 'latitud', 'longitud', 'total_llantas')
        
        data = queryset_to_dataframe(queryset, columns, types)
        response = get_route(data)
        warnings.warn(str(response))

        return Response(response, status=status.HTTP_200_OK)
    

    def create(self, request):
        response = {'message': 'Create function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


    def update(self, request, pk=None):
        response = {'message': 'Update function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


    def partial_update(self, request, pk=None):
        response = {'message': 'Update function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


    def destroy(self, request, pk=None):
        response = {'message': 'Delete function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)
            
