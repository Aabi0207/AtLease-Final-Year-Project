from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from owner.models import Warehouse
from .models import Booking, LeaseCertificate
from .serializers import CustomerWarehouseSerializer, BookingSerializer, LeaseCertificateSerializer
from django.db.models import Prefetch, Case, When, BooleanField, Value, Exists, OuterRef
from django.utils import timezone

class CustomerWarehouseListView(generics.ListAPIView):
    serializer_class = CustomerWarehouseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = timezone.localdate()
        
        # Subquery to check if there is an active paid booking today
        has_active_booking = Booking.objects.filter(
            warehouse=OuterRef('pk'),
            status='PAID',
            end_date__gte=today
        )

        active_bookings_prefetch = Prefetch(
            'bookings',
            queryset=Booking.objects.filter(status='PAID', end_date__gte=today).order_by('end_date'),
            to_attr='_active_bookings'
        )

        queryset = Warehouse.objects.prefetch_related('media', active_bookings_prefetch)

        # Annotate so we can sort: Available (has_active=False) first, then Not Available (True)
        queryset = queryset.annotate(
            is_booked=Exists(has_active_booking)
        ).order_by('is_booked', '-created_at').distinct()

        return queryset


class CustomerMarketplaceStatsView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        today = timezone.localdate()

        total_spaces = Warehouse.objects.count()
        verified_owners = Warehouse.objects.values('owner_id').distinct().count()
        active_bookings = Booking.objects.filter(
            status='PAID',
            end_date__gte=today,
        )
        occupied_spaces = active_bookings.values('warehouse_id').distinct().count()
        occupancy_rate = round((occupied_spaces / total_spaces) * 100, 1) if total_spaces else 0

        return Response({
            'total_spaces': total_spaces,
            'verified_owners': verified_owners,
            'occupancy_rate': occupancy_rate,
            'active_bookings': active_bookings.count(),
        })

class CustomerWarehouseDetailView(generics.RetrieveAPIView):
    serializer_class = CustomerWarehouseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = timezone.localdate()
        active_bookings_prefetch = Prefetch(
            'bookings',
            queryset=Booking.objects.filter(status='PAID', end_date__gte=today),
            to_attr='_active_bookings'
        )
        return Warehouse.objects.prefetch_related('media', active_bookings_prefetch)


class CustomerBookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).select_related('warehouse', 'customer')

    def perform_create(self, serializer):
        if getattr(self.request.user, 'role', '') != 'CUSTOMER' and not self.request.user.is_superuser:
            raise PermissionDenied('Only customers can create bookings.')
        serializer.save(customer=self.request.user)


class CustomerCertificateListView(generics.ListAPIView):
    serializer_class = LeaseCertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LeaseCertificate.objects.filter(booking__customer=self.request.user).select_related(
            'booking', 'booking__warehouse', 'booking__customer'
        )

