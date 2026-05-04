from django.conf import settings
from django.db import models

from apps.security.fields import EncryptedJSONField, EncryptedTextField


class MpesaTransaction(models.Model):
    class TxType(models.TextChoices):
        DEPOSIT    = "deposit",    "Deposit (C2B)"
        WITHDRAWAL = "withdrawal", "Withdrawal (B2C)"

    class TxStatus(models.TextChoices):
        PENDING   = "pending",   "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        MINTED    = "minted",    "Minted"
        BURNED    = "burned",    "Burned"
        FAILED    = "failed",    "Failed"

    user             = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="mpesa_transactions",
    )
    mpesa_receipt    = models.CharField(max_length=20, unique=True, db_index=True)
    phone_number     = EncryptedTextField(max_length=15)
    amount_kes       = models.DecimalField(max_digits=12, decimal_places=2)
    tx_type          = models.CharField(max_length=12, choices=TxType.choices)
    status           = models.CharField(
        max_length=12, choices=TxStatus.choices, default=TxStatus.PENDING
    )
    stellar_tx_hash  = models.CharField(max_length=64, blank=True, default="")
    raw_payload      = EncryptedJSONField(default=dict)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tx_type} {self.mpesa_receipt} KES {self.amount_kes} [{self.status}]"
