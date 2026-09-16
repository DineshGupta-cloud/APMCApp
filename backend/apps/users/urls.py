from django.urls import path

from .rbac_management_views import (
    AssignPermissionView,
    AssignRoleView,
    AuditLogListView,
    PermissionListView,
    RemovePermissionView,
    RemoveRoleView,
    RoleListView,
    RolePermissionListView,
    UserActivationView,
    UserDetailView,
    UserListCreateView,
    UserRoleListView,
)
from .role_management_views import RoleManagementDetailView, RoleManagementListView
from .rbac_views import RBACProtectedTestView, RBACPublicTestView
from .views import LoginView, LogoutView, MeView, RefreshView

app_name = "users"

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("rbac/public-test/", RBACPublicTestView.as_view(), name="rbac-public-test"),
    path("rbac/protected-test/", RBACProtectedTestView.as_view(), name="rbac-protected-test"),
    path("rbac/users/", UserListCreateView.as_view(), name="rbac-users"),
    path("rbac/users/<int:user_id>/", UserDetailView.as_view(), name="rbac-user-detail"),
    path("rbac/users/<int:user_id>/roles/", UserRoleListView.as_view(), name="rbac-user-roles"),
    path("rbac/users/roles/assign/", AssignRoleView.as_view(), name="rbac-assign-role"),
    path("rbac/users/<int:user_id>/roles/<int:role_id>/", RemoveRoleView.as_view(), name="rbac-remove-role"),
    path("rbac/users/<int:user_id>/deactivate/", UserActivationView.as_view(), {"activate": False}, name="rbac-user-deactivate"),
    path("rbac/users/<int:user_id>/activate/", UserActivationView.as_view(), {"activate": True}, name="rbac-user-activate"),
    path("rbac/roles/", RoleManagementListView.as_view(), name="rbac-roles"),
    path("rbac/roles/<int:role_id>/", RoleManagementDetailView.as_view(), name="rbac-role-detail"),
    path("rbac/roles/<int:role_id>/permissions/", RolePermissionListView.as_view(), name="rbac-role-permissions"),
    path("rbac/permissions/", PermissionListView.as_view(), name="rbac-permissions"),
    path("rbac/roles/permissions/assign/", AssignPermissionView.as_view(), name="rbac-assign-permission"),
    path("rbac/roles/<int:role_id>/permissions/<int:permission_id>/", RemovePermissionView.as_view(), name="rbac-remove-permission"),
    path("rbac/audit-logs/", AuditLogListView.as_view(), name="rbac-audit-logs"),
]
