from datetime import date, timedelta

from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .engine import calculate_trust_score
from .models import LoanRequest
from .serializers import LoanRequestSerializer, LoanResponseSerializer, TrustScoreSerializer

_ERR_BELOW_LIMIT = "Requested amount exceeds your current credit limit."
_ERR_OPEN_LOAN   = "You already have an open loan. Repay it before requesting another."


class TrustScoreView(views.APIView):
    """GET /api/trust/score/ — Returns the user's trust score and credit limit."""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = calculate_trust_score(request.user)
        serializer = TrustScoreSerializer(data=data)
        serializer.is_valid()
        return Response(serializer.data)


class LoanRequestView(views.APIView):
    """POST /api/trust/loan/ — Creates a loan request if within credit limit."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = LoanRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data["amount_kes"]

        # Block if open loan exists
        if LoanRequest.objects.filter(
            user=request.user,
            status__in=[LoanRequest.LoanStatus.PENDING, LoanRequest.LoanStatus.APPROVED],
        ).exists():
            return Response({"detail": _ERR_OPEN_LOAN}, status=status.HTTP_409_CONFLICT)

        score_data = calculate_trust_score(request.user)
        limit = score_data["credit_limit_kes"]

        if float(amount) > limit:
            return Response({"detail": _ERR_BELOW_LIMIT}, status=status.HTTP_400_BAD_REQUEST)

        repay_by = date.today() + timedelta(days=30)
        loan = LoanRequest.objects.create(
            user=request.user,
            amount_kes=amount,
            trust_score_at=score_data["trust_score"],
            repay_by=repay_by,
        )

        resp = LoanResponseSerializer(
            data={
                "detail":     "Loan request submitted.",
                "amount_kes": amount,
                "repay_by":   repay_by,
                "loan_id":    loan.pk,
            }
        )
        resp.is_valid()
        return Response(resp.data, status=status.HTTP_201_CREATED)
