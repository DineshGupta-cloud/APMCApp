from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Permission, Role, RolePermission, UserRole

User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "code", "name", "description", "is_active")
        read_only_fields = ("id",)


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("id", "code", "name", "module", "action", "description", "is_active")
        read_only_fields = ("id",)


class UserRoleSerializer(serializers.ModelSerializer):
    role_code = serializers.CharField(source="role.code", read_only=True)
    role_name = serializers.CharField(source="role.name", read_only=True)

    class Meta:
        model = UserRole
        fields = ("id", "user", "role", "role_code", "role_name", "is_active")
        read_only_fields = ("id", "role_code", "role_name")


class UserRBACSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "is_active", "is_staff", "roles")
        read_only_fields = ("id", "is_staff", "roles")

    def get_roles(self, obj):
        return list(
            obj.user_roles.filter(is_active=True, role__is_active=True)
            .values("role_id", "role__code", "role__name")
        )


class CreateUserRBACSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name", "is_active")

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class AssignRoleSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(min_value=1)
    role_id = serializers.IntegerField(min_value=1)

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value

    def validate_role_id(self, value):
        if not Role.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Active role not found.")
        return value


class AssignPermissionSerializer(serializers.Serializer):
    role_id = serializers.IntegerField(min_value=1)
    permission_id = serializers.IntegerField(min_value=1)

    def validate_role_id(self, value):
        if not Role.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Active role not found.")
        return value

    def validate_permission_id(self, value):
        if not Permission.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Active permission not found.")
        return value
