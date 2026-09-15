from django.core.management.base import BaseCommand

from apps.users.models import Role


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


class Command(BaseCommand):
    help = "Create or update the default APMC RBAC roles."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for code, name, description in DEFAULT_ROLES:
            role, created = Role.objects.update_or_create(
                code=code,
                defaults={
                    "name": name,
                    "description": description,
                    "is_active": True,
                },
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created role: {role.code}"))
            else:
                updated_count += 1
                self.stdout.write(f"Verified role: {role.code}")

        self.stdout.write(
            self.style.SUCCESS(
                f"RBAC roles ready. Created={created_count}, Updated={updated_count}."
            )
        )
