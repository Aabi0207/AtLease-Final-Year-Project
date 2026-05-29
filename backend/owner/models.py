from django.db import models
from django.conf import settings

class Warehouse(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='warehouses')
    title = models.CharField(max_length=255)
    description = models.TextField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField(help_text="Capacity in sq ft")
    available_from = models.DateField()
    is_available = models.BooleanField(default=True)

    # Features
    has_parking = models.BooleanField(default=False)
    has_security = models.BooleanField(default=False)
    has_cctv = models.BooleanField(default=False)
    has_loading_dock = models.BooleanField(default=False)
    power_backup = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WarehouseMedia(models.Model):
    MEDIA_TYPES = (
        ('IMAGE', 'Image'),
        ('VIDEO', 'Video'),
    )
    warehouse = models.ForeignKey(Warehouse, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to='warehouse_media/')
    media_type = models.CharField(max_length=5, choices=MEDIA_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.warehouse.title} - {self.media_type}"

