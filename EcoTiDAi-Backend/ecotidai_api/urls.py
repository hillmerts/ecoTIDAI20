from rest_framework.routers import DefaultRouter
from .views import PuntoRecoleccionViewSet

router = DefaultRouter()

router.register(r'recoleccion', PuntoRecoleccionViewSet)

urlpatterns = router.urls