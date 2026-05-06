"""
Alien ID Verification Service — calls the external IPRS Alien Check API.
Falls back to the local mock database if ALIEN_CHECK_API_URL is not configured.
"""
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

class AlienCheckError(Exception):
    """Raised when the external Alien Check API returns an error."""
    pass

# --- FIX 1: Added last_name to the main function signature ---
def verify_alien_id(identifier: str, last_name: str = None) -> dict:
    """
    Verify an Alien ID against the external IPRS Alien Check API.
    """
    api_url = getattr(settings, 'ALIEN_CHECK_API_URL', None)
    api_token = getattr(settings, 'ALIEN_CHECK_API_TOKEN', None)

    if not api_url or not api_token:
        # --- FIX 2: Pass the last_name to the mock helper ---
        return _verify_via_mock(identifier, last_name)

    try:
        return _verify_via_api(api_url, api_token, identifier)
    except AlienCheckError as e:
        logger.warning(f"Youverify API failed ({e}). Falling back to mock DB.")
        return _verify_via_mock(identifier, last_name)


def _verify_via_api(api_url: str, api_token: str, identifier: str) -> dict:
    """
    Call the Youverify Alien ID verification endpoint.

    Endpoint : POST https://api.youverify.co/v2/api/identity/ke/alien-id
    Header   : token: <api_token>
    Body     : {"id": "<identifier>", "isSubjectConsent": true}

    Sandbox test IDs:
        111111111  → success (status: "found")
        000000000  → failure (404 ResourceNotFoundError)
    """
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": api_token,
    }

    payload = {
        "id": identifier,
        "isSubjectConsent": True,
    }

    # ── 1. Make the request ──────────────────────────────────────────────
    try:
        resp = requests.post(api_url, headers=headers, json=payload, timeout=30)
    except requests.ConnectionError as exc:
        logger.error("Youverify API connection failed: %s", exc)
        raise AlienCheckError("Cannot reach verification service. Please try again.")
    except requests.Timeout:
        logger.error("Youverify API request timed out for ID: %s", identifier)
        raise AlienCheckError("Verification service timed out. Please try again.")
    except requests.RequestException as exc:
        logger.error("Youverify API request error: %s", exc)
        raise AlienCheckError(f"Network error: {exc}")

    # ── 2. Parse JSON body ───────────────────────────────────────────────
    try:
        data = resp.json()
    except ValueError:
        logger.error(
            "Youverify returned non-JSON (HTTP %s): %s",
            resp.status_code, resp.text[:200],
        )
        raise AlienCheckError("Verification service returned an invalid response.")

    # ── 3. Handle HTTP-level errors ──────────────────────────────────────

    # 401 / 403 — bad or expired API token
    if resp.status_code in (401, 403):
        logger.error(
            "Youverify auth failed (HTTP %s): %s",
            resp.status_code, data.get("message", ""),
        )
        raise AlienCheckError("Verification service authentication failed.")

    # 404 — ID not found in the registry (ResourceNotFoundError)
    if resp.status_code == 404:
        logger.info("Youverify 404 — Alien ID not found: %s", identifier)
        return {
            "verified": False,
            "full_name": None,
            "id_number": identifier,
            "raw_response": data,
        }

    # 429 — rate limited
    if resp.status_code == 429:
        logger.warning("Youverify rate limit hit")
        raise AlienCheckError("Too many requests. Please wait and try again.")

    # Any other non-200 status
    if resp.status_code != 200:
        logger.error(
            "Youverify unexpected HTTP %s: %s",
            resp.status_code, data.get("message", ""),
        )
        raise AlienCheckError(
            f"Verification service error (HTTP {resp.status_code})."
        )

    # ── 4. Handle JSON-level success/failure ─────────────────────────────

    # API returned 200 but success=false (shouldn't happen often, but safe)
    if not data.get("success", False):
        message = data.get("message", "Verification failed")
        logger.warning("Youverify 200 but success=false: %s", message)
        return {
            "verified": False,
            "full_name": None,
            "id_number": identifier,
            "raw_response": data,
        }

    # ── 5. Parse successful verification ─────────────────────────────────
    identity = data.get("data", {})
    status_value = identity.get("status", "")
    verified = status_value == "found"

    # Build full name: prefer fullName, then compose from parts
    full_name = identity.get("fullName") or " ".join(
        filter(None, [
            identity.get("firstName", ""),
            identity.get("middleName", ""),
            identity.get("lastName", ""),
        ])
    ) or None

    if verified:
        logger.info(
            "Youverify VERIFIED — ID: %s, name: %s, allValidationPassed: %s",
            identity.get("idNumber", identifier),
            full_name,
            identity.get("allValidationPassed"),
        )
    else:
        logger.info(
            "Youverify NOT verified — ID: %s, status: %s",
            identifier, status_value,
        )

    return {
        "verified": verified,
        "full_name": full_name,
        "id_number": identity.get("idNumber", identifier),
        "raw_response": data,
    }


def _verify_via_mock(identifier: str, last_name_input: str = None) -> dict:
    """Fall back to the local AlienID mock table."""
    import hashlib
    from .models import AlienID

    # --- FIX 3: Use cleaned identifier consistently ---
    id_clean = identifier.strip()
    hashed = hashlib.sha256(id_clean.encode()).hexdigest()
    
    record = AlienID.objects.filter(hashed_rin=hashed, is_active=True).first()

    if not record:
        record = AlienID.objects.filter(id_number=id_clean, is_active=True).first()

    if record:
        # Matching logic
        if last_name_input:
            if record.last_name.strip().lower() != last_name_input.strip().lower():
                return {
                    "verified": False,
                    "full_name": None, # Security: Hide real name on mismatch
                    "id_number": id_clean,
                    "raw_response": {
                        "source": "mock_db",
                        "error": "name_mismatch"
                    },
                }

        return {
            "verified": True,
            "full_name": record.full_name,
            "id_number": id_clean,
            "raw_response": {"source": "mock_db"},
        }

    return {
        "verified": False,
        "full_name": None,
        "id_number": id_clean,
        "raw_response": {"source": "mock_db", "error": "not_found"},
    }