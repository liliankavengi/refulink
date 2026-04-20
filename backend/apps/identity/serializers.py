from rest_framework import serializers


class RINVerificationSerializer(serializers.Serializer):
    """Accepts the alien ID number for verification."""
    identifier = serializers.CharField(
        max_length=50,
        required=True,
        help_text="Alien ID number to verify (e.g. 12345678)",
    )


class AlienCheckResponseSerializer(serializers.Serializer):
    """Shapes the successful verification response."""
    verified = serializers.BooleanField()
    message = serializers.CharField()
    user_info = serializers.DictField(child=serializers.CharField(), required=False)
    tokens = serializers.DictField(child=serializers.CharField(), required=False)
