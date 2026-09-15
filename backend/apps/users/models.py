from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    roles = models.ManyToManyField(
        "Role",
        through="UserRole",
        related_name="users",
        blank=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Role(models.Model):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    APMC_ADMIN = "APMC_ADMIN"
    TRADER = "TRADER"
    FARMER = "FARMER"
    COMMISSION_AGENT = "COMMISSION_AGENT"
    EMPLOYEE = "EMPLOYEE"
    VIEWER = "VIEWER"

    DEFAULT_CODES = (
        SUPER_ADMIN,
        ADMIN,
        APMC_ADMIN,
        TRADER,
        FARMER,
        COMMISSION_AGENT,
        EMPLOYEE,
        VIEWER,
    )

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("code",)

    def __str__(self):
        return self.code


class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    module = models.CharField(max_length=100)
    action = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("module", "action", "code")
        constraints = [
            models.UniqueConstraint(
                fields=("module", "action"),
                name="users_permission_module_action_uniq",
            )
        ]

    def __str__(self):
        return self.code


class RolePermission(models.Model):
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="role_permissions",
    )
    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        related_name="role_permissions",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("role__code", "permission__code")
        constraints = [
            models.UniqueConstraint(
                fields=("role", "permission"),
                name="users_role_permission_uniq",
            )
        ]

    def __str__(self):
        return f"{self.role.code} -> {self.permission.code}"


class UserRole(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_roles",
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="user_roles",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("user__email", "role__code")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "role"),
                name="users_user_role_uniq",
            )
        ]

    def __str__(self):
        return f"{self.user.email} -> {self.role.code}"
