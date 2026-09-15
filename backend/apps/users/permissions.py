from rest_framework.permissions import BasePermission


class HasRBACPermission(BasePermission):
    """
    Production RBAC permission.

    Usage:
        permission_classes = [HasRBACPermission]
        required_permission = "USER_VIEW"

    Authentication failures remain 401 via DRF/JWT.
    Authenticated users without the required permission receive 403.
    """

    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        required_permission = getattr(view, "required_permission", None)
        if not required_permission:
            return False

        return request.user.user_roles.filter(
            is_active=True,
            role__is_active=True,
            role__role_permissions__is_active=True,
            role__role_permissions__permission__code=required_permission,
            role__role_permissions__permission__is_active=True,
        ).exists()


class IsRBACAuthenticated(BasePermission):
    """Explicit authenticated-user permission for protected endpoints."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
