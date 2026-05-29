from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow:
    1. Read-only to anyone.
    2. Create only by users with role 'OWNER'.
    3. Update/Delete only by the owner of the object.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # For non-safe methods (POST, PUT, DELETE), user needs to be an 'OWNER'
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'OWNER'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
