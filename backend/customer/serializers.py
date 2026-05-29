from rest_framework import serializers
from django.utils import timezone
from owner.models import Warehouse
from owner.serializers import WarehouseMediaSerializer
from .models import Booking, LeaseCertificate

class CustomerWarehouseSerializer(serializers.ModelSerializer):
    media = WarehouseMediaSerializer(many=True, read_only=True)
    name = serializers.CharField(source='title', read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    is_available = serializers.SerializerMethodField()
    available_from = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    area = serializers.SerializerMethodField()
    occupancy = serializers.SerializerMethodField()
    booking_count = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    leaseTerm = serializers.SerializerMethodField()
    
    class Meta:
        model = Warehouse
        fields = [
            'id', 'title', 'name', 'owner_username', 'location', 'city', 'state',
            'price_per_month', 'price', 'capacity', 'area', 'region', 'occupancy',
            'booking_count', 'is_available', 'available_from', 'leaseTerm', 'image', 'gallery', 'media',
            'has_parking', 'has_security', 'has_cctv', 'has_loading_dock', 'power_backup',
            'amenities', 'description', 'address'
        ]

    # Handle missing location field (maybe address mapped to location)
    location = serializers.CharField(source='address', read_only=True)

    def get_image(self, obj):
        first_media = obj.media.all().order_by('uploaded_at').first()
        if first_media:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(first_media.file.url)
            return first_media.file.url
        return ''

    def get_gallery(self, obj):
        request = self.context.get('request')
        gallery = []
        for media_item in obj.media.all().order_by('uploaded_at'):
            url = media_item.file.url
            if request is not None:
                url = request.build_absolute_uri(url)
            gallery.append(url)
        return gallery

    def get_region(self, obj):
        return obj.state

    def get_price(self, obj):
        return f"${obj.price_per_month:,.0f}"

    def get_area(self, obj):
        return f"{obj.capacity:,} sq ft"

    def get_occupancy(self, obj):
        today = timezone.localdate()
        active_booking = obj.bookings.filter(status='PAID', end_date__gte=today).exists()
        return 100 if active_booking else 0

    def get_booking_count(self, obj):
        return obj.bookings.filter(status='PAID').count()

    def get_amenities(self, obj):
        amenities = []
        if obj.has_parking:
            amenities.append('Parking')
        if obj.has_security:
            amenities.append('Security')
        if obj.has_cctv:
            amenities.append('CCTV')
        if obj.has_loading_dock:
            amenities.append('Loading dock')
        if obj.power_backup:
            amenities.append('Power backup')
        return amenities

    def get_leaseTerm(self, obj):
        return f"Available from {obj.available_from}"

    def get_is_available(self, obj):
        today = timezone.localdate()
        bookings = getattr(obj, '_active_bookings', None)
        
        # If prefetched
        if bookings is not None:
            return not bool(bookings)
            
        # Fallback if not prefetched
        active = obj.bookings.filter(status='PAID', end_date__gte=today).exists()
        return not active

    def get_available_from(self, obj):
        today = timezone.localdate()
        bookings = getattr(obj, '_active_bookings', None)
        
        if bookings is not None:
            if bookings:
                latest = max(bookings, key=lambda b: b.end_date)
                return latest.end_date
            return obj.available_from or today
            
        # Fallback if not prefetched
        active_booking = obj.bookings.filter(status='PAID', end_date__gte=today).order_by('-end_date').first()
        if active_booking:
            return active_booking.end_date
            
        return obj.available_from or today


class LeaseCertificateSerializer(serializers.ModelSerializer):
    warehouse_title = serializers.CharField(source='booking.warehouse.title', read_only=True)
    warehouse_city = serializers.CharField(source='booking.warehouse.city', read_only=True)
    warehouse_state = serializers.CharField(source='booking.warehouse.state', read_only=True)
    warehouse_address = serializers.CharField(source='booking.warehouse.address', read_only=True)
    warehouse_id = serializers.IntegerField(source='booking.warehouse.id', read_only=True)
    customer_username = serializers.CharField(source='booking.customer.username', read_only=True)
    customer_display_name = serializers.SerializerMethodField()
    lease_start_date = serializers.DateField(source='booking.start_date', read_only=True)
    lease_end_date = serializers.DateField(source='booking.end_date', read_only=True)
    lease_duration_months = serializers.SerializerMethodField()
    monthly_rent = serializers.DecimalField(source='booking.warehouse.price_per_month', max_digits=10, decimal_places=2, read_only=True)
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = LeaseCertificate
        fields = [
            'id', 'certificate_id', 'token_id', 'chain', 'transaction_hash',
            'metadata_uri', 'status', 'minted_at', 'warehouse_title',
            'warehouse_city', 'warehouse_state', 'warehouse_address', 'warehouse_id',
            'customer_username', 'customer_display_name', 'lease_start_date', 'lease_end_date',
            'lease_duration_months', 'monthly_rent', 'metadata', 'booking'
        ]
        read_only_fields = fields

    def get_customer_display_name(self, obj):
        customer = obj.booking.customer
        full_name = f"{customer.first_name} {customer.last_name}".strip()
        return full_name or customer.username

    def get_lease_duration_months(self, obj):
        start_date = obj.booking.start_date
        end_date = obj.booking.end_date
        return max(1, (end_date.year - start_date.year) * 12 + end_date.month - start_date.month)

    def get_metadata(self, obj):
        booking = obj.booking
        warehouse = booking.warehouse
        customer = booking.customer

        return {
            'name': 'AtLease Warehouse Lease Certificate',
            'description': 'Non-transferable digital lease certificate issued by AtLease',
            'certificate_id': obj.certificate_id,
            'lessee': {
                'display_name': self.get_customer_display_name(obj),
                'lessee_reference_id': f'LESSEE-{customer.id:04d}',
            },
            'warehouse': {
                'warehouse_id': f'WH-{warehouse.id:04d}',
                'location': f'{warehouse.city}, {warehouse.state}',
                'title': warehouse.title,
                'address': warehouse.address,
            },
            'lease_terms': {
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'duration_months': self.get_lease_duration_months(obj),
            },
            'issuer': {
                'platform': 'AtLease',
                'issued_by': 'AtLease Platform Wallet',
            },
            'blockchain': {
                'network': obj.chain,
                'token_standard': 'ERC-721',
                'transferable': False,
            },
            'version': '1.0',
            'mint': {
                'token_id': obj.token_id,
                'transaction_hash': obj.transaction_hash,
                'metadata_uri': obj.metadata_uri,
                'status': obj.status,
            },
        }


class BookingSerializer(serializers.ModelSerializer):
    warehouse_details = CustomerWarehouseSerializer(source='warehouse', read_only=True)
    certificate = LeaseCertificateSerializer(read_only=True)
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    warehouse = serializers.PrimaryKeyRelatedField(queryset=Warehouse.objects.all(), write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'warehouse', 'warehouse_details',
            'start_date', 'end_date', 'status', 'created_at', 'certificate'
        ]
        read_only_fields = ['id', 'customer', 'status', 'created_at', 'warehouse_details', 'certificate']

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        warehouse = attrs.get('warehouse')

        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({'end_date': 'End date must be after start date.'})

        if warehouse and start_date and end_date and warehouse.bookings.filter(
            status='PAID',
            start_date__lte=end_date,
            end_date__gte=start_date,
        ).exists():
            raise serializers.ValidationError({'warehouse': 'This warehouse is currently unavailable.'})

        if warehouse and not warehouse.is_available:
            raise serializers.ValidationError({'warehouse': 'This warehouse is currently unavailable.'})

        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['customer'] = request.user
        validated_data['status'] = Booking.STATUS_CHOICES[1][0]
        booking = super().create(validated_data)
        metadata_uri = request.data.get('metadata_uri', '')
        transaction_hash = request.data.get('transaction_hash', '')
        certificate_id = request.data.get('certificate_id', '')
        token_id = request.data.get('token_id', '')
        chain = request.data.get('chain', 'Polygon')

        # Create a placeholder certificate immediately so the UI can display a verifiable record.
        lease_certificate, _ = LeaseCertificate.objects.get_or_create(
            booking=booking,
            defaults={
                'certificate_id': certificate_id or f'AL-{booking.id:06d}',
                'token_id': token_id or f'0x{booking.id:04x}lease',
                'chain': chain,
                'transaction_hash': transaction_hash,
                'metadata_uri': metadata_uri,
                'status': LeaseCertificate.Status.MINTED,
            }
        )

        if lease_certificate.booking_id != booking.id:
            lease_certificate.booking = booking
            lease_certificate.save(update_fields=['booking'])

        updates = []
        if metadata_uri and lease_certificate.metadata_uri != metadata_uri:
            lease_certificate.metadata_uri = metadata_uri
            updates.append('metadata_uri')

        if transaction_hash and lease_certificate.transaction_hash != transaction_hash:
            lease_certificate.transaction_hash = transaction_hash
            updates.append('transaction_hash')

        if updates:
            lease_certificate.save(update_fields=updates)

        return booking

