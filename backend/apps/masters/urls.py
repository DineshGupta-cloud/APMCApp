from django.urls import path

from .views import BranchView, CommodityView, FarmerView, MarketView, YardView

app_name = "masters"

urlpatterns = [
    path("markets/", MarketView.as_view(), name="markets"),
    path("markets/<int:object_id>/", MarketView.as_view(), name="market-detail"),
    path("yards/", YardView.as_view(), name="yards"),
    path("yards/<int:object_id>/", YardView.as_view(), name="yard-detail"),
    path("branches/", BranchView.as_view(), name="branches"),
    path("branches/<int:object_id>/", BranchView.as_view(), name="branch-detail"),
    path("commodities/", CommodityView.as_view(), name="commodities"),
    path("commodities/<int:object_id>/", CommodityView.as_view(), name="commodity-detail"),
    path("farmers/", FarmerView.as_view(), name="farmers"),
    path("farmers/<int:farmer_id>/", FarmerView.as_view(), name="farmer-detail"),
]
