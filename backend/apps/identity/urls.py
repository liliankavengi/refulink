from django.urls import path
from .views import VerifyRINView

app_name = 'identity'

urlpatterns = [
    path('verify-rin/', VerifyRINView.as_view(), name='verify-rin'),
]
