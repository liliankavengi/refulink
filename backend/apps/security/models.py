from django.conf import settings
from django.db import models


class AMLLog(models.Model):
    class SourceType(models.TextChoices):
        WALLET = "wallet", "Wallet"
        MPESA = "mpesa", "M-Pesa"

    class TransactionState(models.TextChoices):
        ATTEMPTED = "attempted", "Attempted"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    class ReviewStatus(models.TextChoices):
        FLAGGED = "flagged", "Flagged"
        REVIEWED = "reviewed", "Reviewed"
        ESCALATED = "escalated", "Escalated"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="aml_logs",
    )
    source_type = models.CharField(max_length=20, choices=SourceType.choices)
    source_reference = models.CharField(max_length=128)
    amount_kes = models.DecimalField(max_digits=14, decimal_places=2)
    threshold_kes = models.DecimalField(max_digits=14, decimal_places=2)
    transaction_state = models.CharField(
        max_length=12,
        choices=TransactionState.choices,
        default=TransactionState.COMPLETED,
    )
    review_status = models.CharField(
        max_length=12,
        choices=ReviewStatus.choices,
        default=ReviewStatus.FLAGGED,
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AML Log"
        verbose_name_plural = "AML Logs"
        constraints = [
            models.UniqueConstraint(
                fields=["source_type", "source_reference"],
                name="unique_aml_log_source_reference",
            )
        ]

    def __str__(self):
        return f"{self.source_type} {self.source_reference} KES {self.amount_kes} [{self.review_status}]"
