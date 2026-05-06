from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*', '192.168.100.147', '192.168.100.71']

CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins in dev mode

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
