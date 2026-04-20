from django.db import models

class AlienID(models.Model):
    """
    Mock IPRS (Integrated Population Registration System) model for Alien ID verification.
    Stores hashed RINs for secure comparison.
    """
    id_number = models.CharField(max_length=20, unique=True, help_text="The Alien ID card number")
    full_name = models.CharField(max_length=255)
    hashed_rin = models.CharField(max_length=64, unique=True, help_text="SHA-256 hash of the RIN")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.id_number})"

    class Meta:
        verbose_name = "Alien ID"
        verbose_name_plural = "Alien IDs"
