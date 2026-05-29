from django.contrib import admin
from .models import Warehouse, WarehouseMedia

class WarehouseMediaInline(admin.TabularInline):
    model = WarehouseMedia
    extra = 1

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'city', 'price_per_month', 'is_available')
    list_filter = ('is_available', 'city', 'state')
    search_fields = ('title', 'address', 'city')
    inlines = [WarehouseMediaInline]

