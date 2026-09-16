from django.db import models


class MasterBase(models.Model):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("name",)


class Market(MasterBase):
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Yard(MasterBase):
    market = models.ForeignKey(Market, on_delete=models.PROTECT, related_name="yards")
    location = models.CharField(max_length=200, blank=True)

    class Meta(MasterBase.Meta):
        constraints = [models.UniqueConstraint(fields=("market", "name"), name="masters_yard_market_name_uniq")]

    def __str__(self):
        return f"{self.code} - {self.name}"


class Branch(MasterBase):
    market = models.ForeignKey(Market, on_delete=models.PROTECT, related_name="branches")
    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    class Meta(MasterBase.Meta):
        constraints = [models.UniqueConstraint(fields=("market", "name"), name="masters_branch_market_name_uniq")]

    def __str__(self):
        return f"{self.code} - {self.name}"


class Commodity(MasterBase):
    unit = models.CharField(max_length=30, default="Quintal")
    category = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Farmer(models.Model):
    farmer_code = models.CharField(max_length=50, unique=True, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    mobile = models.CharField(max_length=15, db_index=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    village = models.CharField(max_length=150, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    land_area = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    land_area_unit = models.CharField(max_length=20, default="Acre")
    market = models.ForeignKey(Market, on_delete=models.PROTECT, null=True, blank=True, related_name="farmers")
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("first_name", "last_name", "farmer_code")
        indexes = [
            models.Index(fields=("mobile", "is_active")),
            models.Index(fields=("market", "is_active")),
        ]

    def __str__(self):
        return f"{self.farmer_code} - {self.first_name} {self.last_name}".strip()
