from rest_framework import serializers


class BreakdownSerializer(serializers.Serializer):
    verified_bonus = serializers.IntegerField()
    vouch_points   = serializers.IntegerField()
    volume_points  = serializers.IntegerField()
    age_points     = serializers.IntegerField()


class TrustScoreSerializer(serializers.Serializer):
    trust_score      = serializers.IntegerField(min_value=0, max_value=100)
    credit_limit_kes = serializers.IntegerField(min_value=0)
    breakdown        = BreakdownSerializer()
    repay_by         = serializers.DateField()


class LoanRequestSerializer(serializers.Serializer):
    amount_kes = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=1
    )


class LoanResponseSerializer(serializers.Serializer):
    detail      = serializers.CharField()
    amount_kes  = serializers.DecimalField(max_digits=12, decimal_places=2)
    repay_by    = serializers.DateField()
    loan_id     = serializers.IntegerField()
