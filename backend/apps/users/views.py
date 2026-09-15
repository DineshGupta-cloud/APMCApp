from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .audit import record_audit
from .models import AuditLog
from .serializers import LoginSerializer, LogoutSerializer, UserMeSerializer


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK and response.data.get("access"):
            token = AccessToken(response.data["access"])
            user_id = token.get("user_id")
            actor = self._get_user(user_id)
            record_audit(
                request=request,
                actor=actor,
                action=AuditLog.LOGIN,
                target_type="User",
                target_id=user_id,
            )
        return response

    @staticmethod
    def _get_user(user_id):
        from django.contrib.auth import get_user_model
        return get_user_model().objects.filter(id=user_id).first()


class RefreshView(TokenRefreshView):
    pass


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record_audit(
            request=request,
            actor=request.user,
            action=AuditLog.LOGOUT,
            target_type="User",
            target_id=request.user.id,
        )
        return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
