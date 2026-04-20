import os
import django

import sys
from pathlib import Path

# Add backend directory to path so Django can find the config module
backend_dir = Path(__file__).resolve().parent.parent / 'backend'
sys.path.append(str(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

import hashlib
from django.contrib.auth.models import User
from apps.identity.models import AlienID

def seed():
    # Seed superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@refulink.com', 'adminpassword')
        print("Superuser created!")

    # Seed Mock Alien ID database (IPRS)
    mock_aliens = [
        {"identifier": "12345678", "id_number": "12345678", "name": "John Doe"},
        {"identifier": "87654321", "id_number": "87654321", "name": "Jane Smith"},
        {"identifier": "REFU-001", "id_number": "REFU-001", "name": "Abdi Hassan"},
    ]

    for alien in mock_aliens:
        hashed = hashlib.sha256(alien['identifier'].encode()).hexdigest()
        obj, created = AlienID.objects.get_or_create(
            id_number=alien['id_number'],
            defaults={
                'full_name': alien['name'],
                'hashed_rin': hashed,
                'is_active': True
            }
        )
        if created:
            print(f"Seeded Alien ID: {alien['name']} (Hashed RIN: {hashed[:10]}...)")

if __name__ == '__main__':
    seed()

