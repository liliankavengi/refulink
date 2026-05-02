from django.urls import path
from .views import LoanRequestView, TrustScoreView

urlpatterns = [
    path("score/", TrustScoreView.as_view()),
    path("loan/",  LoanRequestView.as_view()),
]
