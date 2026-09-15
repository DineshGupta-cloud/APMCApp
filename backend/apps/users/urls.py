from django.urls import path

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
]
