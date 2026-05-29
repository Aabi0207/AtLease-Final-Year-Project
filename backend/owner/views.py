import calendar
from datetime import date
from decimal import Decimal

from django.utils import timezone
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Warehouse, WarehouseMedia
from .serializers import WarehouseSerializer, WarehouseMediaSerializer
from .permissions import IsOwnerOrReadOnly
from customer.models import Booking, LeaseCertificate
from customer.serializers import BookingSerializer, LeaseCertificateSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all().order_by('-created_at')
    serializer_class = WarehouseSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def my_listings(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if getattr(request.user, 'role', '') != 'OWNER' and not request.user.is_superuser:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
            
        warehouses = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(warehouses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        if getattr(request.user, 'role', '') != 'OWNER' and not request.user.is_superuser:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.localdate()
        month_start = today.replace(day=1)
        month_end = date(today.year, today.month, calendar.monthrange(today.year, today.month)[1])

        warehouses = Warehouse.objects.filter(owner=request.user)
        total_listings = warehouses.count()

        active_bookings = Booking.objects.filter(
            warehouse__owner=request.user,
            status='PAID',
            start_date__lte=today,
            end_date__gte=today,
        ).select_related('warehouse')

        occupied_warehouse_ids = active_bookings.values_list('warehouse_id', flat=True).distinct()
        occupied_listings = occupied_warehouse_ids.count()

        occupancy_rate = round((occupied_listings / total_listings) * 100, 1) if total_listings else 0

        month_bookings = Booking.objects.filter(
            warehouse__owner=request.user,
            status='PAID',
            start_date__lte=month_end,
            end_date__gte=month_start,
        ).select_related('warehouse')

        total_revenue = sum((booking.warehouse.price_per_month for booking in Booking.objects.filter(
            warehouse__owner=request.user,
            status='PAID'
        ).select_related('warehouse')), Decimal('0'))

        revenue_this_month = sum((booking.warehouse.price_per_month for booking in month_bookings), Decimal('0'))

        return Response({
            'total_listings': total_listings,
            'active_listings': total_listings,
            'occupied_listings': occupied_listings,
            'occupancy_rate': occupancy_rate,
            'revenue_this_month': str(revenue_this_month),
            'total_revenue': str(total_revenue),
        })

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_media(self, request, pk=None):
        warehouse = self.get_object()
        
        # Determine files
        files = request.FILES.getlist('file')
        
        if not files:
            return Response({'detail': 'No files provided.'}, status=status.HTTP_400_BAD_REQUEST)

        media_objects = []
        for file in files:
            content_type = file.content_type
            media_type = 'IMAGE'
            if content_type and content_type.startswith('video'):
                media_type = 'VIDEO'
            
            media_objects.append(WarehouseMedia(
                warehouse=warehouse,
                file=file,
                media_type=media_type
            ))
        
        WarehouseMedia.objects.bulk_create(media_objects)
        
        # Return updated warehouse data with media nested
        serializer = self.get_serializer(warehouse)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OwnerBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(warehouse__owner=self.request.user).select_related('warehouse', 'customer')


class OwnerCertificateListView(generics.ListAPIView):
    serializer_class = LeaseCertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LeaseCertificate.objects.filter(booking__warehouse__owner=self.request.user).select_related(
            'booking', 'booking__warehouse', 'booking__customer'
        )

