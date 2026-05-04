"""
Trust Score Engine
==================
Scores range 0-100 and map to a KES credit limit.

This version uses:
  - vouch_points  : +50 if the user is vouched
  - volume_points : +1 per KES 1000 of completed transaction volume, capped at 50

Credit limits by score:
  81-100 -> KES 30 000
  61-80  -> KES 15 000
  31-60  -> KES  5 000
  0-30   -> KES      0
"""

from datetime import date, timedelta
from decimal import Decimal


def _credit_limit(score: int) -> int:
    if score >= 81:
        return 30_000
    if score >= 61:
        return 15_000
    if score >= 31:
        return 5_000
    return 0


def calculate_trust_score(user) -> dict:
    from apps.identity.models import VerificationStatus
    from apps.wallet.models import TransactionLog

    breakdown = {
        "verified_bonus": 0,
        "vouch_points": 0,
        "volume_points": 0,
        "age_points": 0,
    }

    try:
        identity = user.refugee_identity
        if identity.verification_status == VerificationStatus.VOUCHED:
            breakdown["vouch_points"] = 50
    except Exception:
        pass

    total_volume = Decimal("0")
    logs = TransactionLog.objects.filter(
        user=user,
        status=TransactionLog.TxStatus.COMPLETED,
    )
    for log in logs:
        total_volume += log.amount_kes

    breakdown["volume_points"] = min(int(total_volume / Decimal("1000")), 50)

    total = sum(breakdown.values())
    total = max(0, min(total, 100))

    repay_by = (date.today() + timedelta(days=30)).isoformat()

    return {
        "trust_score": total,
        "credit_limit_kes": _credit_limit(total),
        "breakdown": breakdown,
        "repay_by": repay_by,
    }