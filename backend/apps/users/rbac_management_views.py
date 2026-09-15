from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Permission, Role, RolePermission, UserRole
from .permissions import HasRBACPermission
from .rbac_serializers import (
    AssignPermissionSerializer,
    AssignRoleSerializer,
    CreateUserRBACSerializer,
    PermissionSerializer,
    RoleSerializer,
    UserRBACSerializer,
    UserRoleSerializer,
)

User = get_user_model()


class UserListCreateView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "USER_VIEW"

    def get(self, request):
        users = User.objects.prefetch_related("user_roles__role").order_by("email")
        return Response(UserRBACSerializer(users, many=True).data)

    def post(self, request):
        self.required_permission = "USER_CREATE"
        if not request.user.is_superuser and not HasRBACPermission().has_permission(request, self):
            return Response(
                {"detail": HasRBACPermission.message},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = CreateUserRBACSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(UserRBACSerializer(serializer.save()).data, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "USER_VIEW"

    def get(self, request, user_id):
        try:
            user = User.objects.prefetch_related("user_roles__role").get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserRBACSerializer(user).data)


class UserRoleListView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "USER_VIEW"

    def get(self, request, user_id):
        roles = UserRole.objects.filter(user_id=user_id).select_related("role")
        return Response(UserRoleSerializer(roles, many=True).data)


class AssignRoleView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "USER_UPDATE"

    def post(self, request):
        serializer = AssignRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data["user_id"]
        role_id = serializer.validated_data["role_id"]
        role = Role.objects.get(id=role_id)

        # Only the Django superuser may grant the SUPER_ADMIN role.
        if role.code == Role.SUPER_ADMIN and not request.user.is_superuser:
            return Response(
                {"detail": "Only a superuser can assign the SUPER_ADMIN role."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user_role, created = UserRole.objects.update_or_create(
            user_id=user_id,
            role_id=role_id,
            defaults={"is_active": True},
        )
        return Response(
            UserRoleSerializer(user_role).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class RemoveRoleView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "USER_UPDATE"

    def delete(self, request, user_id, role_id):
        if user_id == request.user.id:
            return Response(
                {"detail": "You cannot remove your own role."},
                status=status.HTTP_403_FORBIDDEN,
            )

        role = Role.objects.filter(id=role_id).first()
        if role and role.code == Role.SUPER_ADMIN and not request.user.is_superuser:
            return Response(
                {"detail": "Only a superuser can remove the SUPER_ADMIN role."},
                status=status.HTTP_403_FORBIDDEN,
            )

        updated = UserRole.objects.filter(
            user_id=user_id,
            role_id=role_id,
            is_active=True,
        ).update(is_active=False)
        if not updated:
            return Response(
                {"detail": "Active user-role mapping not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"detail": "Role removed from user."})


class RoleListView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_VIEW"

    def get(self, request):
        return Response(RoleSerializer(Role.objects.all(), many=True).data)


class PermissionListView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "PERMISSION_VIEW"

    def get(self, request):
        return Response(PermissionSerializer(Permission.objects.all(), many=True).data)


class RolePermissionListView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_VIEW"

    def get(self, request, role_id):
        mappings = RolePermission.objects.filter(role_id=role_id).select_related("role", "permission")
        return Response(
            [
                {
                    "id": mapping.id,
                    "role_id": mapping.role_id,
                    "role_code": mapping.role.code,
                    "permission_id": mapping.permission_id,
                    "permission_code": mapping.permission.code,
                    "is_active": mapping.is_active,
                }
                for mapping in mappings
            ]
        )


class AssignPermissionView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_MANAGE"

    def post(self, request):
        serializer = AssignPermissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = Role.objects.get(id=serializer.validated_data["role_id"])
        permission = Permission.objects.get(id=serializer.validated_data["permission_id"])

        # Only the Django superuser may modify permissions of SUPER_ADMIN.
        if role.code == Role.SUPER_ADMIN and not request.user.is_superuser:
            return Response(
                {"detail": "Only a superuser can modify SUPER_ADMIN permissions."},
                status=status.HTTP_403_FORBIDDEN,
            )

        mapping, created = RolePermission.objects.update_or_create(
            role=role,
            permission=permission,
            defaults={"is_active": True},
        )
        return Response(
            {
                "id": mapping.id,
                "role": role.code,
                "permission": permission.code,
                "is_active": mapping.is_active,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class RemovePermissionView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_MANAGE"

    def delete(self, request, role_id, permission_id):
        role = Role.objects.filter(id=role_id).first()
        if role and role.code == Role.SUPER_ADMIN and not request.user.is_superuser:
            return Response(
                {"detail": "Only a superuser can modify SUPER_ADMIN permissions."},
                status=status.HTTP_403_FORBIDDEN,
            )

        updated = RolePermission.objects.filter(
            role_id=role_id,
            permission_id=permission_id,
            is_active=True,
        ).update(is_active=False)
        if not updated:
            return Response(
                {"detail": "Active role-permission mapping not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"detail": "Permission removed from role."})
