from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie

from .serializers import UserRegistrationSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Sets a CSRF cookie on the client.
    """
    return Response({"message": "CSRF cookie set"})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user (OWNER or CUSTOMER).
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Log in a user via session authentication.
    """
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')
    requested_role = request.data.get('role')

    if not password or (not email and not username):
        return Response(
            {"error": "Please provide your email and password."}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    user = None

    if email:
        from .models import User

        matched_user = User.objects.filter(email__iexact=email).first()
        if matched_user is not None:
            user = authenticate(request, username=matched_user.username, password=password)

    if user is None and username:
        user = authenticate(request, username=username, password=password)

    if user is not None:
        if requested_role and getattr(user, 'role', '') != requested_role:
            return Response(
                {"error": "This account does not match the selected login role."},
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)  # Create the user session
        return Response({
            "message": "Login successful.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Invalid credentials. Please try again."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Log out the currently authenticated user.
    """
    logout(request)
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
