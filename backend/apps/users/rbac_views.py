from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import HasRBACPermission


class RBACProtectedTestView(APIView):
    """Temporary RBAC verification endpoint. Replace with business endpoints later."""

    permission_classes = [HasRBACPermission]
    required_permission = "DASHBOARD_VIEW"

    def get(self, request):
        return Response(
            {
                "status": "ok",
                "message": "RBAC permission granted.",
                "permission": self.required_permission,
                "user": request.user.email,
            }
        )


class RBACPublicTestView(APIView):
    """Public endpoint used only to confirm the RBAC test route is reachable."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "message": "Public RBAC test endpoint."})
