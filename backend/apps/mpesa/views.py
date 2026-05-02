import logging
import uuid

from django.contrib.auth.models import User
from rest_framework import status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import MpesaTransaction
from .serializers import C2BCallbackSerializer, DepositInfoSerializer, WithdrawalRequestSerializer
from .services import burn_tokens_for_withdrawal, get_deposit_info, mint_tokens_for_deposit, trigger_b2c_payment

logger = logging.getLogger(__name__)

_ERR_NO_IDENTITY = "No Stellar identity registered."
_ERR_BALANCE     = "Insufficient KES balance for withdrawal."


def _get_identity(user):
    try:
        return user.refugee_identity
    except Exception:
        return None


class DepositInfoView(views.APIView):
    """GET /api/mpesa/deposit-info/ — Returns Paybill details."""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        info = get_deposit_info()
        serializer = DepositInfoSerializer(data=info)
        serializer.is_valid()
        return Response(serializer.data)


class C2BCallbackView(views.APIView):
    """
    POST /api/mpesa/c2b/
    Safaricom Daraja posts here when a Paybill payment is received.
    Idempotent — duplicate TransIDs are ignored.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = C2BCallbackSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning("Invalid C2B payload: %s", request.data)
            return Response({"ResultCode": "C2B00011", "ResultDesc": "Rejected"})

        receipt  = serializer.validated_data["TransID"]
        phone    = serializer.validated_data["MSISDN"]
        amount   = float(serializer.validated_data["TransAmount"])

        if MpesaTransaction.objects.filter(mpesa_receipt=receipt).exists():
            return Response({"ResultCode": "0", "ResultDesc": "Accepted"})

        tx = MpesaTransaction.objects.create(
            mpesa_receipt=receipt,
            phone_number=phone,
            amount_kes=amount,
            tx_type=MpesaTransaction.TxType.DEPOSIT,
            raw_payload=request.data,
        )

        # Try to match phone to a known user's identity
        stellar_address = None
        try:
            from apps.identity.models import RefugeeIdentity
            identity = RefugeeIdentity.objects.filter(
                user__username__icontains=phone[-6:]
            ).first()
            if identity:
                stellar_address = identity.stellar_public_key
                tx.user = identity.user
        except Exception:
            pass

        if stellar_address:
            try:
                stellar_hash = mint_tokens_for_deposit(stellar_address, amount)
                tx.stellar_tx_hash = stellar_hash
                tx.status = MpesaTransaction.TxStatus.MINTED
            except Exception as exc:
                logger.error("Minting failed for %s: %s", receipt, exc)
                tx.status = MpesaTransaction.TxStatus.FAILED
        else:
            tx.status = MpesaTransaction.TxStatus.CONFIRMED

        tx.save(update_fields=["user", "stellar_tx_hash", "status"])
        return Response({"ResultCode": "0", "ResultDesc": "Accepted"})


class WithdrawalView(views.APIView):
    """
    POST /api/mpesa/withdraw/
    Burns KES tokens on Stellar then triggers a B2C payout to the user's phone.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = WithdrawalRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identity = _get_identity(request.user)
        if not identity:
            return Response({"detail": _ERR_NO_IDENTITY}, status=status.HTTP_400_BAD_REQUEST)

        amount = float(serializer.validated_data["amount_kes"])
        phone  = serializer.validated_data["phone_number"]

        receipt = f"WD{uuid.uuid4().hex[:10].upper()}"

        tx = MpesaTransaction.objects.create(
            user=request.user,
            mpesa_receipt=receipt,
            phone_number=phone,
            amount_kes=amount,
            tx_type=MpesaTransaction.TxType.WITHDRAWAL,
            raw_payload={"initiated_by": request.user.username},
        )

        try:
            stellar_hash = burn_tokens_for_withdrawal(identity.stellar_public_key, amount)
            tx.stellar_tx_hash = stellar_hash
            tx.status = MpesaTransaction.TxStatus.BURNED
            tx.save(update_fields=["stellar_tx_hash", "status"])
        except Exception as exc:
            tx.status = MpesaTransaction.TxStatus.FAILED
            tx.save(update_fields=["status"])
            return Response(
                {"detail": f"Token burn failed: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            daraja_resp = trigger_b2c_payment(phone, amount)
        except Exception as exc:
            return Response(
                {"detail": f"M-Pesa B2C error: {exc}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "detail":        "Withdrawal initiated.",
                "amount_kes":    amount,
                "phone_number":  phone,
                "stellar_hash":  stellar_hash,
                "daraja_ref":    daraja_resp.get("ConversationID", receipt),
            },
            status=status.HTTP_200_OK,
        )
