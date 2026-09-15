from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Permission


class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)


class UserMeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    roles = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    def get_roles(self, user):
        return list(
            user.user_roles.filter(
                is_active=True,
                role__is_active=True,
            )
            .values_list("role__code", flat=True)
            .order_by("role__code")
        )

    def get_permissions(self, user):
        if user.is_superuser:
            return list(
                Permission.objects.filter(is_active=True)
                .values_list("code", flat=True)
                .order_by("code")
            )

        return list(
            Permission.objects.filter(
                is_active=True,
                role_permissions__is_active=True,
                role_permissions__role__user_roles__user=user,
                role_permissions__role__user_roles__is_active=True,
                role_permissions__role__is_active=True,
            )
            .distinct()
            .values_list("code", flat=True)
            .order_by("code")
        )
