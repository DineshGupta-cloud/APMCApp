from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .audit import record_audit
from .models import AuditLog, Permission, Role, RolePermission
from .permissions import HasRBACPermission
from .rbac_serializers import RoleSerializer


class RoleManagementListView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_VIEW"

    def get(self, request):
        roles = Role.objects.all().order_by("code")
        return Response(RoleSerializer(roles, many=True).data)

    def post(self, request):
        self.required_permission = "ROLE_MANAGE"
        if not HasRBACPermission().has_permission(request, self):
            return Response({"detail": HasRBACPermission.message}, status=status.HTTP_403_FORBIDDEN)
        serializer = RoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        record_audit(
            request=request, actor=request.user, action="ROLE_CREATE",
            target_type="Role", target_id=role.id,
            metadata={"code": role.code, "name": role.name},
        )
        return Response(RoleSerializer(role).data, status=status.HTTP_201_CREATED)


class RoleManagementDetailView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_VIEW"

    def patch(self, request, role_id):
        self.required_permission = "ROLE_MANAGE"
        if not HasRBACPermission().has_permission(request, self):
            return Response({"detail": HasRBACPermission.message}, status=status.HTTP_403_FORBIDDEN)
        role = Role.objects.filter(id=role_id).first()
        if not role:
            return Response({"detail": "Role not found."}, status=status.HTTP_404_NOT_FOUND)
        if role.code == Role.SUPER_ADMIN and not request.user.is_superuser:
            return Response({"detail": "Only a superuser can modify SUPER_ADMIN."}, status=status.HTTP_403_FORBIDDEN)
        serializer = RoleSerializer(role, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        record_audit(
            request=request, actor=request.user, action="ROLE_UPDATE",
            target_type="Role", target_id=updated.id,
            metadata={"code": updated.code, "is_active": updated.is_active},
        )
        return Response(RoleSerializer(updated).data)


class RolePermissionManagementView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "ROLE_VIEW"

    def get(self, request, role_id):
        if not Role.objects.filter(id=role_id).exists():
            return Response({"detail": "Role not found."}, status=status.HTTP_404_NOT_FOUND)
        mappings = RolePermission.objects.filter(role_id=role_id, is_active=True).select_related("permission").order_by("permission__module", "permission__action", "permission__code")
        return Response([
            {
                "id": mapping.id,
                "role_id": mapping.role_id,
                "permission_id": mapping.permission_id,
                "permission_code": mapping.permission.code,
                "permission_name": mapping.permission.name,
                "module": mapping.permission.module,
                "action": mapping.permission.action,
                "description": mapping.permission.description,
                "is_active": mapping.is_active,
            }
            for mapping in mappings
        ])
