"""
Registration Audit Logger — CBK AML/CFT compliance.
Logs every identity verification attempt and registration event.
"""
import logging

from django.conf import settings
from django.db import models

logger = logging.getLogger("security.audit")


class RegistrationAuditLog(models.Model):
    """Immutable audit trail for registration events (CBK AML/CFT)."""

    class EventType(models.TextChoices):
        RIN_VERIFY_SUCCESS = "rin_verify_success", "RIN Verified"
        RIN_VERIFY_FAIL = "rin_verify_fail", "RIN Verification Failed"
        IDENTITY_REGISTERED = "identity_registered", "Identity Registered"
        IDENTITY_DUPLICATE = "identity_duplicate", "Duplicate Registration Blocked"
        KEYPAIR_GENERATED = "keypair_generated", "Stellar Keypair Generated"
        ONCHAIN_ANCHOR_OK = "onchain_anchor_ok", "On-Chain Anchor Succeeded"
        ONCHAIN_ANCHOR_FAIL = "onchain_anchor_fail", "On-Chain Anchor Failed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="registration_audit_logs",
    )
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    identifier_hash = models.CharField(
        max_length=64,
        blank=True,
        default="",
        help_text="SHA-256 of the identifier used (never store raw PII).",
    )
    stellar_public_key = models.CharField(max_length=56, blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    extra = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Registration Audit Log"
        verbose_name_plural = "Registration Audit Logs"

    def __str__(self):
        return f"[{self.created_at}] {self.event_type} — {self.identifier_hash[:12]}..."


def log_registration_event(
    *,
    event_type: str,
    request=None,
    user=None,
    identifier_hash: str = "",
    stellar_public_key: str = "",
    extra: dict | None = None,
):
    """
    Creates an immutable audit record and emits a structured log line.
    Must be called for every verification and registration action.
    """
    ip = _get_client_ip(request) if request else None
    ua = request.META.get("HTTP_USER_AGENT", "") if request else ""

    entry = RegistrationAuditLog.objects.create(
        user=user,
        event_type=event_type,
        identifier_hash=identifier_hash,
        stellar_public_key=stellar_public_key,
        ip_address=ip,
        user_agent=ua,
        extra=extra or {},
    )

    logger.info(
        "AUDIT | %s | user=%s hash=%s ip=%s",
        event_type,
        user.pk if user else "anon",
        identifier_hash[:12],
        ip,
    )
    return entry


def _get_client_ip(request) -> str | None:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
