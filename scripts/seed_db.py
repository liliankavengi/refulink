import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth.models import User
# Add more mock data logic here

def seed():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@refulink.com', 'adminpassword')
        print("Superuser created!")

if __name__ == '__main__':
    seed()
