"""
Alien ID Verification Service — calls the external IPRS Alien Check API.
Falls back to the local mock database if ALIEN_CHECK_API_URL is not configured.
"""
import logging
import requests
from requests.structures import CaseInsensitiveDict
from django.conf import settings

logger = logging.getLogger(__name__)


class AlienCheckError(Exception):
    """Raised when the external Alien Check API returns an error."""
    pass


def verify_alien_id(identifier: str) -> dict:
    """
    Verify an Alien ID against the external IPRS Alien Check API.

    Args:
        identifier: The alien ID number to verify (e.g. "12345678").

    Returns:
        dict with at minimum:
            - verified (bool)
            - full_name (str | None)
            - id_number (str)
            - raw_response (dict)  — the complete API payload

    Raises:
        AlienCheckError on network / API-level failures.
    """
    api_url = getattr(settings, 'ALIEN_CHECK_API_URL', None)
    api_token = getattr(settings, 'ALIEN_CHECK_API_TOKEN', None)

    if not api_url or not api_token:
        # Fall back to local mock database
        return _verify_via_mock(identifier)

    return _verify_via_api(api_url, api_token, identifier)


def _verify_via_api(api_url: str, api_token: str, identifier: str) -> dict:
    """Call the live Alien Check endpoint."""

    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    headers["Authorization"] = f"Bearer {api_token}"
    headers["Content-Type"] = "application/json"

    payload = {
        "search_type": "ALIENCHECK",
        "identifier": identifier,
        "consent": "1",
        "consent_collected_by": "",
    }

    try:
        resp = requests.post(api_url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as exc:
        logger.error("Alien Check API request failed: %s", exc)
        raise AlienCheckError(f"Network error contacting verification service: {exc}")

    if resp.status_code != 200:
        logger.warning(
            "Alien Check API returned status %s: %s",
            resp.status_code,
            resp.text[:500],
        )
        raise AlienCheckError(
            f"Verification service returned status {resp.status_code}"
        )

    try:
        data = resp.json()
    except ValueError:
        raise AlienCheckError("Verification service returned invalid JSON")

    # --- Interpret the response ---
    # Adapt the field names below to match the actual API contract.
    # Common patterns: data["data"]["identity"], data["result"], etc.
    identity = data.get("data", data)  # try nested "data" key first

    verified = bool(identity.get("valid", identity.get("identity_verified", False)))

    full_name = " ".join(
        filter(None, [
            identity.get("first_name", ""),
            identity.get("middle_name", ""),
            identity.get("last_name", identity.get("surname", "")),
        ])
    ) or identity.get("name", None)

    return {
        "verified": verified,
        "full_name": full_name,
        "id_number": identifier,
        "raw_response": data,
    }


def _verify_via_mock(identifier: str) -> dict:
    """Fall back to the local AlienID mock table."""
    import hashlib
    from .models import AlienID

    hashed = hashlib.sha256(identifier.encode()).hexdigest()
    record = AlienID.objects.filter(
        hashed_rin=hashed, is_active=True
    ).first()

    if not record:
        # Also try a direct id_number lookup (non-hashed convenience)
        record = AlienID.objects.filter(
            id_number=identifier, is_active=True
        ).first()

    if record:
        return {
            "verified": True,
            "full_name": record.full_name,
            "id_number": record.id_number,
            "raw_response": {"source": "mock_db"},
        }

    return {
        "verified": False,
        "full_name": None,
        "id_number": identifier,
        "raw_response": {"source": "mock_db"},
    }
