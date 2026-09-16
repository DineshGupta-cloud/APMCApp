from rest_framework import serializers

from .models import Branch, Commodity, Farmer, Market, Yard


class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = ["id", "code", "name", "description", "location", "is_active", "created_at", "updated_at"]
        read_only_fields = ("id", "created_at", "updated_at")


class YardSerializer(serializers.ModelSerializer):
    market_name = serializers.CharField(source="market.name", read_only=True)

    class Meta:
        model = Yard
        fields = ["id", "code", "name", "description", "is_active", "created_at", "updated_at", "market", "location", "market_name"]
        read_only_fields = ("id", "created_at", "updated_at", "market_name")


class BranchSerializer(serializers.ModelSerializer):
    market_name = serializers.CharField(source="market.name", read_only=True)

    class Meta:
        model = Branch
        fields = ["id", "code", "name", "description", "is_active", "created_at", "updated_at", "market", "address", "phone", "market_name"]
        read_only_fields = ("id", "created_at", "updated_at", "market_name")


class CommoditySerializer(serializers.ModelSerializer):
    class Meta:
        model = Commodity
        fields = ["id", "code", "name", "description", "is_active", "created_at", "updated_at", "unit", "category"]
        read_only_fields = ("id", "created_at", "updated_at")


class FarmerSerializer(serializers.ModelSerializer):
    market_name = serializers.CharField(source="market.name", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Farmer
        fields = [
            "id", "farmer_code", "first_name", "last_name", "full_name", "mobile", "email",
            "address", "village", "district", "state", "pincode", "land_area", "land_area_unit",
            "market", "market_name", "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ("id", "created_at", "updated_at", "market_name", "full_name")

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def validate_mobile(self, value):
        value = value.strip()
        if not value.isdigit() or not 10 <= len(value) <= 15:
            raise serializers.ValidationError("Mobile number must contain 10 to 15 digits.")
        return value
