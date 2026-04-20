from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import RINVerificationSerializer, AlienCheckResponseSerializer
from .services import verify_alien_id, AlienCheckError

class VerifyRINView(views.APIView):
    """
    Endpoint to verify an Alien ID number.
    Calls the IPRS Alien Check API (via the service layer).
    Generates a JWT on success.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RINVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data['identifier']

        try:
            result = verify_alien_id(identifier)
        except AlienCheckError as e:
            return Response(
                {"verified": False, "message": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        if result.get("verified"):
            # Ensure full_name is a string (default to empty if None)
            full_name = result.get("full_name") or "Unknown Alien"
            
            # On success, generate a JWT.
            # Create/get a user based on the ID number.
            user, _ = User.objects.get_or_create(
                username=f"alien_{result['id_number']}",
                defaults={'first_name': full_name[:30]} # Django first_name has limit
            )

            refresh = RefreshToken.for_user(user)
            
            response_data = {
                "verified": True,
                "message": "Identity verified successfully.",
                "user_info": {
                    "full_name": full_name,
                    "id_number": result["id_number"]
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }
            
            response_serializer = AlienCheckResponseSerializer(data=response_data)
            response_serializer.is_valid() # Will always be valid based on our construction
            
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        
        return Response({
            "verified": False,
            "message": "Invalid identifier. Verification failed."
        }, status=status.HTTP_403_FORBIDDEN)
