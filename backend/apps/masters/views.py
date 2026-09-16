from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import HasRBACPermission

from .models import Branch, Commodity, Farmer, Market, Yard
from .serializers import BranchSerializer, CommoditySerializer, FarmerSerializer, MarketSerializer, YardSerializer


class MasterCrudView(APIView):
    model = None
    serializer_class = None
    required_permission = None

    permission_classes = [HasRBACPermission]

    def get_queryset(self):
        queryset = self.model.objects.all()
        search = self.request.query_params.get("search", "").strip()
        active = self.request.query_params.get("active")
        if search:
            queryset = queryset.filter(Q(code__icontains=search) | Q(name__icontains=search))
        if active in {"true", "false"}:
            queryset = queryset.filter(is_active=active == "true")
        return queryset

    def get(self, request, object_id=None):
        if object_id:
            instance = self.get_queryset().get(pk=object_id)
            return Response(self.serializer_class(instance).data)
        return Response(self.serializer_class(self.get_queryset(), many=True).data)

    def post(self, request, object_id=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(self.serializer_class(instance).data, status=status.HTTP_201_CREATED)

    def patch(self, request, object_id=None):
        instance = self.model.objects.get(pk=object_id)
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(self.serializer_class(serializer.save()).data)

    def delete(self, request, object_id=None):
        instance = self.model.objects.get(pk=object_id)
        instance.is_active = False
        instance.save(update_fields=["is_active", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MarketView(MasterCrudView):
    model = Market
    serializer_class = MarketSerializer
    required_permission = "MARKET_MANAGE"


class YardView(MasterCrudView):
    model = Yard
    serializer_class = YardSerializer
    required_permission = "YARD_MANAGE"


class BranchView(MasterCrudView):
    model = Branch
    serializer_class = BranchSerializer
    required_permission = "BRANCH_MANAGE"


class CommodityView(MasterCrudView):
    model = Commodity
    serializer_class = CommoditySerializer
    required_permission = "COMMODITY_MANAGE"


class FarmerView(APIView):
    permission_classes = [HasRBACPermission]
    required_permission = "FARMER_VIEW"

    def get_queryset(self):
        queryset = Farmer.objects.select_related("market").all()
        search = self.request.query_params.get("search", "").strip()
        active = self.request.query_params.get("active")
        if search:
            queryset = queryset.filter(
                Q(farmer_code__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(mobile__icontains=search)
                | Q(village__icontains=search)
            )
        if active in {"true", "false"}:
            queryset = queryset.filter(is_active=active == "true")
        return queryset

    def get(self, request, farmer_id=None):
        if farmer_id:
            farmer = self.get_queryset().get(pk=farmer_id)
            return Response(FarmerSerializer(farmer).data)
        return Response(FarmerSerializer(self.get_queryset(), many=True).data)

    def post(self, request):
        self.required_permission = "FARMER_CREATE"
        self.check_permissions(request)
        serializer = FarmerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(FarmerSerializer(serializer.save()).data, status=status.HTTP_201_CREATED)

    def patch(self, request, farmer_id):
        self.required_permission = "FARMER_UPDATE"
        self.check_permissions(request)
        farmer = Farmer.objects.get(pk=farmer_id)
        serializer = FarmerSerializer(farmer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(FarmerSerializer(serializer.save()).data)

    def delete(self, request, farmer_id):
        self.required_permission = "FARMER_DEACTIVATE"
        self.check_permissions(request)
        farmer = Farmer.objects.get(pk=farmer_id)
        farmer.is_active = False
        farmer.save(update_fields=["is_active", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)
