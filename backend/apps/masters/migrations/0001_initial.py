from django.db import migrations, models
import django.db.models.deletion


def seed_permissions(apps, schema_editor):
    Permission = apps.get_model("users", "Permission")
    permissions = [
        ("MARKET_MANAGE", "Manage Markets", "Masters", "manage"),
        ("YARD_MANAGE", "Manage Yards", "Masters", "manage"),
        ("BRANCH_MANAGE", "Manage Branches", "Masters", "manage"),
        ("COMMODITY_MANAGE", "Manage Commodities", "Masters", "manage"),
        ("FARMER_VIEW", "View Farmers", "Farmers", "view"),
        ("FARMER_CREATE", "Create Farmers", "Farmers", "create"),
        ("FARMER_UPDATE", "Update Farmers", "Farmers", "update"),
        ("FARMER_DEACTIVATE", "Deactivate Farmers", "Farmers", "deactivate"),
    ]
    for code, name, module, action in permissions:
        Permission.objects.get_or_create(
            code=code,
            defaults={"name": name, "module": module, "action": action, "description": name, "is_active": True},
        )


def remove_permissions(apps, schema_editor):
    Permission = apps.get_model("users", "Permission")
    Permission.objects.filter(code__in=[
        "MARKET_MANAGE", "YARD_MANAGE", "BRANCH_MANAGE", "COMMODITY_MANAGE",
        "FARMER_VIEW", "FARMER_CREATE", "FARMER_UPDATE", "FARMER_DEACTIVATE",
    ]).delete()


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0002_role_permission_userrole_user_roles_rolepermission_and_more")]

    operations = [
        migrations.CreateModel(
            name="Market",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(db_index=True, max_length=50, unique=True)),
                ("name", models.CharField(max_length=150)),
                ("description", models.TextField(blank=True)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("location", models.CharField(blank=True, max_length=200)),
            ],
            options={"ordering": ("name",)},
        ),
        migrations.CreateModel(
            name="Commodity",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(db_index=True, max_length=50, unique=True)),
                ("name", models.CharField(max_length=150)),
                ("description", models.TextField(blank=True)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("unit", models.CharField(default="Quintal", max_length=30)),
                ("category", models.CharField(blank=True, max_length=100)),
            ],
            options={"ordering": ("name",)},
        ),
        migrations.CreateModel(
            name="Branch",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(db_index=True, max_length=50, unique=True)),
                ("name", models.CharField(max_length=150)),
                ("description", models.TextField(blank=True)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("address", models.CharField(blank=True, max_length=300)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("market", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="branches", to="masters.market")),
            ],
            options={"ordering": ("name",), "constraints": [models.UniqueConstraint(fields=("market", "name"), name="masters_branch_market_name_uniq")]},
        ),
        migrations.CreateModel(
            name="Yard",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(db_index=True, max_length=50, unique=True)),
                ("name", models.CharField(max_length=150)),
                ("description", models.TextField(blank=True)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("location", models.CharField(blank=True, max_length=200)),
                ("market", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="yards", to="masters.market")),
            ],
            options={"ordering": ("name",), "constraints": [models.UniqueConstraint(fields=("market", "name"), name="masters_yard_market_name_uniq")]},
        ),
        migrations.CreateModel(
            name="Farmer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("farmer_code", models.CharField(db_index=True, max_length=50, unique=True)),
                ("first_name", models.CharField(max_length=100)),
                ("last_name", models.CharField(blank=True, max_length=100)),
                ("mobile", models.CharField(db_index=True, max_length=15)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("address", models.TextField(blank=True)),
                ("village", models.CharField(blank=True, max_length=150)),
                ("district", models.CharField(blank=True, max_length=100)),
                ("state", models.CharField(blank=True, max_length=100)),
                ("pincode", models.CharField(blank=True, max_length=10)),
                ("land_area", models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ("land_area_unit", models.CharField(default="Acre", max_length=20)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("market", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="farmers", to="masters.market")),
            ],
            options={"ordering": ("first_name", "last_name", "farmer_code")},
        ),
        migrations.AddIndex(model_name="farmer", index=models.Index(fields=["mobile", "is_active"], name="masters_farmer_mobile_9a8a4b_idx")),
        migrations.AddIndex(model_name="farmer", index=models.Index(fields=["market", "is_active"], name="masters_farmer_market_8f4a87_idx")),
        migrations.RunPython(seed_permissions, remove_permissions),
    ]
