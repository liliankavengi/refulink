"""
Daraja (M-Pesa) service layer.
All network calls are guarded: if DARAJA credentials are absent the
functions return plausible mock values so the app works offline.
"""

import os
import uuid
from base64 import b64encode
from datetime import datetime

import requests

_CONSUMER_KEY    = os.getenv("DARAJA_CONSUMER_KEY", "")
_CONSUMER_SECRET = os.getenv("DARAJA_CONSUMER_SECRET", "")
_SHORTCODE       = os.getenv("DARAJA_SHORTCODE", "174379")
_PASSKEY         = os.getenv("DARAJA_PASSKEY", "")
_B2C_INITIATOR   = os.getenv("DARAJA_B2C_INITIATOR", "")
_B2C_PASSWORD    = os.getenv("DARAJA_B2C_SECURITY_CREDENTIAL", "")
_CALLBACK_URL    = os.getenv("DARAJA_CALLBACK_URL", "https://refulink.dev/api/mpesa/c2b/")
_B2C_RESULT_URL  = os.getenv("DARAJA_B2C_RESULT_URL", "https://refulink.dev/api/mpesa/b2c/result/")
_B2C_TIMEOUT_URL = os.getenv("DARAJA_B2C_TIMEOUT_URL", "https://refulink.dev/api/mpesa/b2c/timeout/")
_SANDBOX_BASE    = "https://sandbox.safaricom.co.ke"

_DEV_MODE = not (_CONSUMER_KEY and _CONSUMER_SECRET and _PASSKEY)


def _get_access_token() -> str:
    credentials = b64encode(f"{_CONSUMER_KEY}:{_CONSUMER_SECRET}".encode()).decode()
    resp = requests.get(
        f"{_SANDBOX_BASE}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {credentials}"},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def _timestamp() -> str:
    return datetime.now().strftime("%Y%m%d%H%M%S")


def get_deposit_info() -> dict:
    """Returns the Paybill info users should send money to."""
    return {
        "paybill_number": _SHORTCODE,
        "account_number": "REFULINK",
        "instructions": (
            "Go to M-Pesa → Lipa na M-Pesa → Pay Bill. "
            f"Enter Business no. {_SHORTCODE}, Account no. REFULINK, then amount."
        ),
        "dev_mode": _DEV_MODE,
    }


def trigger_b2c_payment(phone_number: str, amount_kes: float) -> dict:
    """
    Triggers a B2C payment from Safaricom to the user's phone.
    In dev mode returns a mock response without hitting Safaricom.
    """
    if _DEV_MODE:
        return {
            "ResponseCode": "0",
            "ResponseDescription": "Dev mode — no real B2C triggered",
            "ConversationID": f"dev-{uuid.uuid4().hex[:10]}",
            "OriginatorConversationID": f"dev-{uuid.uuid4().hex[:10]}",
            "dev_mode": True,
        }

    token = _get_access_token()
    ts = _timestamp()
    password = b64encode(f"{_SHORTCODE}{_PASSKEY}{ts}".encode()).decode()

    payload = {
        "InitiatorName": _B2C_INITIATOR,
        "SecurityCredential": _B2C_PASSWORD,
        "CommandID": "BusinessPayment",
        "Amount": str(int(amount_kes)),
        "PartyA": _SHORTCODE,
        "PartyB": phone_number,
        "Remarks": "RefuLink withdrawal",
        "QueueTimeOutURL": _B2C_TIMEOUT_URL,
        "ResultURL": _B2C_RESULT_URL,
        "Occasion": "Withdrawal",
    }
    resp = requests.post(
        f"{_SANDBOX_BASE}/mpesa/b2c/v1/paymentrequest",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()


def mint_tokens_for_deposit(stellar_address: str, amount_kes: float) -> str:
    """
    Mints KES tokens on Stellar after M-Pesa deposit is confirmed.
    Returns the Stellar tx_hash (or a dev-mode placeholder).
    """
    from apps.wallet.views import _HORIZON_URL, _KES_ASSET_CODE, _KES_ASSET_ISSUER
    sender_secret = os.getenv("SENDER_SECRET_KEY", "")

    if not sender_secret:
        return f"dev-mint-{uuid.uuid4().hex[:16]}"

    from stellar_sdk import Asset, Keypair, Network, Server, TransactionBuilder
    server     = Server(_HORIZON_URL)
    sender_kp  = Keypair.from_secret(sender_secret)
    source     = server.load_account(sender_kp.public_key)
    kes_asset  = Asset(_KES_ASSET_CODE, _KES_ASSET_ISSUER)

    tx = (
        TransactionBuilder(
            source_account=source,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        )
        .set_timeout(30)
        .append_payment_op(destination=stellar_address, asset=kes_asset, amount=str(amount_kes))
        .build()
    )
    tx.sign(sender_kp)
    resp = server.submit_transaction(tx)
    return resp.get("hash", "unknown")


def burn_tokens_for_withdrawal(stellar_address: str, amount_kes: float) -> str:
    """
    Burns (sends back to issuer) KES tokens before B2C payout.
    In production the user's keypair signs this — here we use the relay key.
    """
    from apps.wallet.views import _HORIZON_URL, _KES_ASSET_CODE, _KES_ASSET_ISSUER
    sender_secret = os.getenv("SENDER_SECRET_KEY", "")

    if not sender_secret:
        return f"dev-burn-{uuid.uuid4().hex[:16]}"

    from stellar_sdk import Asset, Keypair, Network, Server, TransactionBuilder
    server     = Server(_HORIZON_URL)
    sender_kp  = Keypair.from_secret(sender_secret)
    source     = server.load_account(sender_kp.public_key)
    kes_asset  = Asset(_KES_ASSET_CODE, _KES_ASSET_ISSUER)

    tx = (
        TransactionBuilder(
            source_account=source,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        )
        .set_timeout(30)
        .append_payment_op(
            destination=_KES_ASSET_ISSUER, asset=kes_asset, amount=str(amount_kes)
        )
        .build()
    )
    tx.sign(sender_kp)
    resp = server.submit_transaction(tx)
    return resp.get("hash", "unknown")
