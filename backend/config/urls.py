from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/identity/', include('apps.identity.urls')),
    path('api/wallet/',   include('apps.wallet.urls')),
    path('api/trust/',    include('apps.trust.urls')),
    # path('api/mpesa/',    include('apps.mpesa.urls')),
]
