from django.urls import path
from .views import (
    CustomerWarehouseListView,
    CustomerMarketplaceStatsView,
    CustomerWarehouseDetailView,
    CustomerBookingListCreateView,
    CustomerCertificateListView,
)

urlpatterns = [
    path('warehouses/', CustomerWarehouseListView.as_view(), name='customer-warehouse-list'),
    path('warehouses/stats/', CustomerMarketplaceStatsView.as_view(), name='customer-marketplace-stats'),
    path('warehouses/<int:pk>/', CustomerWarehouseDetailView.as_view(), name='customer-warehouse-detail'),
    path('bookings/', CustomerBookingListCreateView.as_view(), name='customer-bookings'),
    path('certificates/', CustomerCertificateListView.as_view(), name='customer-certificates'),
]
