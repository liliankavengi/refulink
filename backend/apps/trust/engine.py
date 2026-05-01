"""
Trust Score Engine
==================
Scores range 0–100 and map to a KES credit limit.

Breakdown:
  - verified_bonus  : +50 if VOUCHED, +10 if PENDING
  - vouch_points    : +20 per vouch received (max 20, i.e. 1 vouch)
  - volume_points   : +1 per KES 100 of total tx volume (max 20)
  - age_points      : +1 per day account is active (max 30)

Credit limits by score:
  81–100 → KES 30 000
  61–80  → KES 15 000
  31–60  → KES  5 000
  0–30   → KES      0
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
        "vouch_points":   0,
        "volume_points":  0,
        "age_points":     0,
    }

    # Verification bonus
    try:
        identity = user.refugee_identity
        if identity.verification_status == VerificationStatus.VOUCHED:
            breakdown["verified_bonus"] = 50
            breakdown["vouch_points"]   = 20
        elif identity.verification_status == VerificationStatus.PENDING:
            breakdown["verified_bonus"] = 10
    except Exception:
        pass

    # Transaction volume points
    total_volume = Decimal("0")
    logs = TransactionLog.objects.filter(
        user=user, status=TransactionLog.TxStatus.COMPLETED
    )
    for log in logs:
        total_volume += log.amount_kes
    volume_pts = min(int(total_volume / 100), 20)
    breakdown["volume_points"] = volume_pts

    # Account age points (days since user was created, max 30)
    account_age_days = (date.today() - user.date_joined.date()).days
    breakdown["age_points"] = min(account_age_days, 30)

    total = sum(breakdown.values())
    total = max(0, min(total, 100))

    repay_by = (date.today() + timedelta(days=30)).isoformat()

    return {
        "trust_score":       total,
        "credit_limit_kes":  _credit_limit(total),
        "breakdown":         breakdown,
        "repay_by":          repay_by,
    }
