from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, OwnerBookingListView, OwnerCertificateListView

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')

urlpatterns = [
    path('', include(router.urls)),
    path('bookings/', OwnerBookingListView.as_view(), name='owner-bookings'),
    path('certificates/', OwnerCertificateListView.as_view(), name='owner-certificates'),
]
