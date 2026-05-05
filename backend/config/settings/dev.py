from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*', '192.168.100.74']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://192.168.100.74:8081",
    "http://192.168.100.74",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
