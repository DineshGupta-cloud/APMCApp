from django.contrib import admin
from django.urls import path
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({"status": "ok", "service": "apmc-backend"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
]
