from django.core.management.base import BaseCommand

from apps.users.models import Permission, Role, RolePermission


DEFAULT_ROLES = (
    (Role.SUPER_ADMIN, "Super Admin", "Full system administration access."),
    (Role.ADMIN, "Admin", "Administrative access across the application."),
    (Role.APMC_ADMIN, "APMC Admin", "APMC-level administration and operations."),
    (Role.TRADER, "Trader", "Trader-facing market and transaction access."),
    (Role.FARMER, "Farmer", "Farmer-facing produce and transaction access."),
    (
        Role.COMMISSION_AGENT,
        "Commission Agent",
        "Commission-agent market and transaction access.",
    ),
    (Role.EMPLOYEE, "Employee", "Employee operational access."),
    (Role.VIEWER, "Viewer", "Read-only application access."),
)


DEFAULT_PERMISSIONS = (
    (
        "DASHBOARD_VIEW",
        "View Dashboard",
        "DASHBOARD",
        "VIEW",
        "View role-specific application dashboard.",
    ),
    (
        "USER_VIEW",
        "View Users",
        "USERS",
        "VIEW",
        "View user accounts and basic user information.",
    ),
    (
        "USER_CREATE",
        "Create Users",
        "USERS",
        "CREATE",
        "Create application user accounts.",
    ),
    (
        "USER_UPDATE",
        "Update Users",
        "USERS",
        "UPDATE",
        "Update application user information.",
    ),
    (
        "USER_DEACTIVATE",
        "Deactivate Users",
        "USERS",
        "DEACTIVATE",
        "Deactivate or reactivate application users.",
    ),
    (
        "ROLE_VIEW",
        "View Roles",
        "ROLES",
        "VIEW",
        "View roles and their assigned permissions.",
    ),
    (
        "ROLE_MANAGE",
        "Manage Roles",
        "ROLES",
        "MANAGE",
        "Create, update, activate, or deactivate roles.",
    ),
    (
        "PERMISSION_VIEW",
        "View Permissions",
        "PERMISSIONS",
        "VIEW",
        "View available permissions and role mappings.",
    ),
)


ROLE_PERMISSION_CODES = {
    Role.SUPER_ADMIN: {code for code, *_ in DEFAULT_PERMISSIONS},
    Role.ADMIN: {code for code, *_ in DEFAULT_PERMISSIONS},
    Role.APMC_ADMIN: {
        "DASHBOARD_VIEW",
        "USER_VIEW",
        "USER_CREATE",
        "USER_UPDATE",
        "ROLE_VIEW",
    },
    Role.EMPLOYEE: {
        "DASHBOARD_VIEW",
        "USER_VIEW",
    },
    Role.VIEWER: {
        "DASHBOARD_VIEW",
    },
    Role.TRADER: {
        "DASHBOARD_VIEW",
    },
    Role.FARMER: {
        "DASHBOARD_VIEW",
    },
    Role.COMMISSION_AGENT: {
        "DASHBOARD_VIEW",
    },
}


class Command(BaseCommand):
    help = "Create or update the default APMC RBAC roles, permissions, and mappings."

    def handle(self, *args, **options):
        roles = self._seed_roles()
        permissions = self._seed_permissions()
        mapping_count = self._seed_role_permissions(roles, permissions)

        self.stdout.write(
            self.style.SUCCESS(
                "RBAC seed completed: "
                f"roles={len(roles)}, permissions={len(permissions)}, "
                f"role_permissions={mapping_count}."
            )
        )

    def _seed_roles(self):
        roles = {}

        for code, name, description in DEFAULT_ROLES:
            role, created = Role.objects.update_or_create(
                code=code,
                defaults={
                    "name": name,
                    "description": description,
                    "is_active": True,
                },
            )
            roles[code] = role

            message = "Created" if created else "Verified"
            self.stdout.write(f"{message} role: {role.code}")

        return roles

    def _seed_permissions(self):
        permissions = {}

        for code, name, module, action, description in DEFAULT_PERMISSIONS:
            permission, created = Permission.objects.update_or_create(
                code=code,
                defaults={
                    "name": name,
                    "module": module,
                    "action": action,
                    "description": description,
                    "is_active": True,
                },
            )
            permissions[code] = permission

            message = "Created" if created else "Verified"
            self.stdout.write(f"{message} permission: {permission.code}")

        return permissions

    def _seed_role_permissions(self, roles, permissions):
        mapping_count = 0

        for role_code, permission_codes in ROLE_PERMISSION_CODES.items():
            role = roles[role_code]

            for permission_code in permission_codes:
                permission = permissions[permission_code]
                RolePermission.objects.update_or_create(
                    role=role,
                    permission=permission,
                    defaults={"is_active": True},
                )
                mapping_count += 1

        # Disable stale mappings that are no longer part of the default matrix.
        for role_code, role in roles.items():
            active_permission_codes = ROLE_PERMISSION_CODES[role_code]
            RolePermission.objects.filter(role=role).exclude(
                permission__code__in=active_permission_codes
            ).update(is_active=False)

        return mapping_count
