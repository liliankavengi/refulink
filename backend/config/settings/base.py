import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-default')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Workspace apps
    'apps.identity',
    'apps.wallet',
    'apps.stellar',
    'apps.mpesa',
    'apps.ai_layer',
    'apps.trust',
    'apps.security',
]

# ... common settings ...
