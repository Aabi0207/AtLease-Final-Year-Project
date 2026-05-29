from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
	model = User
	list_display = ('id', 'username', 'email', 'role', 'phone_number', 'is_staff', 'is_active')
	list_filter = ('role', 'is_staff', 'is_active', 'is_superuser')
	search_fields = ('username', 'email', 'phone_number')
	ordering = ('id',)
	fieldsets = BaseUserAdmin.fieldsets + (
		('AtLease Profile', {'fields': ('role', 'phone_number')}),
	)
	add_fieldsets = BaseUserAdmin.add_fieldsets + (
		('AtLease Profile', {'fields': ('role', 'phone_number')}),
	)
