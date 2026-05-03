from decimal import Decimal

from django.conf import settings

from .models import AMLLog


def log_high_value_transaction(
    *,
    source_type: str,
    source_reference: str,
    amount_kes,
    user=None,
    transaction_state: str = AMLLog.TransactionState.COMPLETED,
    notes: str = "",
):
    threshold = getattr(settings, "AML_THRESHOLD_KES", Decimal("10000"))
    amount = Decimal(str(amount_kes))

    if amount <= threshold:
        return None

    log, created = AMLLog.objects.get_or_create(
        source_type=source_type,
        source_reference=source_reference,
        defaults={
            "user": user,
            "amount_kes": amount,
            "threshold_kes": threshold,
            "transaction_state": transaction_state,
            "notes": notes,
        },
    )

    updates = []
    if not created:
        if user and log.user_id is None:
            log.user = user
            updates.append("user")
        if transaction_state and log.transaction_state != transaction_state:
            log.transaction_state = transaction_state
            updates.append("transaction_state")
        if notes and log.notes != notes:
            log.notes = notes
            updates.append("notes")
        if updates:
            log.save(update_fields=updates)

    return log
