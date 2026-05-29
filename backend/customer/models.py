from django.db import models
from django.conf import settings
from owner.models import Warehouse

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    )
    
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} - {self.warehouse.title}"


class LeaseCertificate(models.Model):
    class Status(models.TextChoices):
        MINTED = 'MINTED', 'Minted'
        VERIFIED = 'VERIFIED', 'Verified'
        ARCHIVED = 'ARCHIVED', 'Archived'

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='certificate')
    certificate_id = models.CharField(max_length=64, unique=True)
    token_id = models.CharField(max_length=128)
    chain = models.CharField(max_length=64, default='Polygon')
    transaction_hash = models.CharField(max_length=128, blank=True, default='')
    metadata_uri = models.URLField(blank=True, default='')
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.MINTED)
    minted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.certificate_id} - {self.booking.warehouse.title}"

