from django.conf import settings
from django.db import models


class LoanRequest(models.Model):
    class LoanStatus(models.TextChoices):
        PENDING  = "pending",  "Pending"
        APPROVED = "approved", "Approved"
        REPAID   = "repaid",   "Repaid"
        DEFAULTED = "defaulted", "Defaulted"

    user            = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loan_requests",
    )
    amount_kes      = models.DecimalField(max_digits=12, decimal_places=2)
    trust_score_at  = models.PositiveSmallIntegerField()
    status          = models.CharField(
        max_length=12, choices=LoanStatus.choices, default=LoanStatus.PENDING
    )
    repay_by        = models.DateField(null=True, blank=True)
    requested_at    = models.DateTimeField(auto_now_add=True)
    resolved_at     = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-requested_at"]

    def __str__(self):
        return f"Loan {self.pk} — {self.user} — KES {self.amount_kes} [{self.status}]"
