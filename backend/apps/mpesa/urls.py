from django.urls import path
from .views import C2BCallbackView, DepositInfoView, WithdrawalView

urlpatterns = [
    path("deposit-info/", DepositInfoView.as_view()),
    path("c2b/",          C2BCallbackView.as_view()),
    path("withdraw/",     WithdrawalView.as_view()),
]
