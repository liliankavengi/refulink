from rest_framework import serializers


class C2BCallbackSerializer(serializers.Serializer):
    """Validates the Daraja C2B STK push / paybill callback payload."""
    TransID         = serializers.CharField(max_length=20)
    TransAmount     = serializers.CharField()
    MSISDN          = serializers.CharField(max_length=15)
    BillRefNumber   = serializers.CharField(max_length=50, required=False, default="REFULINK")
    TransactionType = serializers.CharField(required=False, default="Pay Bill")


class WithdrawalRequestSerializer(serializers.Serializer):
    amount_kes   = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=10)
    phone_number = serializers.CharField(max_length=15)

    def validate_phone_number(self, value):
        digits = value.replace("+", "").replace(" ", "")
        if not digits.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if not (10 <= len(digits) <= 13):
            raise serializers.ValidationError("Phone number must be 10–13 digits.")
        return digits


class DepositInfoSerializer(serializers.Serializer):
    paybill_number = serializers.CharField()
    account_number = serializers.CharField()
    instructions   = serializers.CharField()
    dev_mode       = serializers.BooleanField()
