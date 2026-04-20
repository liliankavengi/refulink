from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/identity/', include('apps.identity.urls')),
    # TODO: Implement and uncomment these
    # path('api/wallet/', include('apps.wallet.urls')),
    # path('api/stellar/', include('apps.stellar.urls')),
    # path('api/mpesa/', include('apps.mpesa.urls')),
]
