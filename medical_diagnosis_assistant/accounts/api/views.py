from rest_framework import status, permissions

from rest_framework.decorators import api_view , permission_classes ,authentication_classes
from rest_framework import permissions, status
from .serializers import CreateUserSerializer, \
    CreateOAUTHSerializer, UserProfileSerialize, \
    OTPSerializer, ChangePasswordSerializer, UserSerializer

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User, OtpModel

from django.contrib.auth.hashers import check_password
from .serializers import (
    CreateUserSerializer,
    CreateOAUTHSerializer,
    UserProfileSerialize,
    OTPSerializer,
    ChangePasswordSerializer
)
from accounts.models import User, OtpModel, Doctor
import secrets
from .utils import get_tokens_for_user, send_email
import secrets
from datetime import timedelta
from django.utils import timezone
import requests
import json

from rest_framework.exceptions import ValidationError

class CreateAccountView(APIView):
    """
    API View for creating a new user account.

    This view handles the process of creating a new user account after email verification.
    It expects the client to provide an email and OTP for verification before creating the account.

    Permissions:
    - AllowAny

    HTTP Methods:
    - POST: Create a new user account
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request to create a new user account.

        Args:
            request (Request): The incoming request object.

        Returns:
            Response: A response indicating the result of the account creation attempt.

        Raises:
            ValidationError: If the provided data is invalid.
        """
        try:
            receiver_email = request.data['email']
            if not request.data.get('otp', None):
                return Response({"message": "Verify your email by sending OTP first"},
                                status=status.HTTP_400_BAD_REQUEST)

            user_serializer = CreateUserSerializer(data=request.data)

            if user_serializer.is_valid(raise_exception=True):
                try:
                    otp_obj = OtpModel.objects.get(email=receiver_email)
                except OtpModel.DoesNotExist:
                    return Response({"message": "Verify your email by sending OTP first"},
                                    status=status.HTTP_400_BAD_REQUEST)

                if otp_obj.otp == request.data['otp']:
                    user_serializer.save()
                    return Response({"message": "Account created successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Enter correct OTP"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """
    API View for user login.

    This view handles user authentication and returns JWT tokens upon successful login.

    Permissions:
    - AllowAny

    HTTP Methods:
    - POST: Authenticate user and return tokens
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for user login.

        Args:
            request (Request): The incoming request object containing login credentials.

        Returns:
            Response: JWT tokens if login is successful, error message otherwise.
        """
        try:
            email = request.data['email']
            password = request.data['password']
            user = User.objects.get(email=email)

            if not check_password(password, user.password):
                return Response({"password": "Wrong password"}, status=status.HTTP_400_BAD_REQUEST)

            if user.is_active:
                token = get_tokens_for_user(user)
                return Response({
                    'refresh': token['refresh'],
                    'access': token['access'],
                    'is_doctor': user.is_doctor
                }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    """
    API View for user logout.

    This view handles user logout by blacklisting the refresh token.

    Authentication:
    - JWT Authentication

    Permissions:
    - IsAuthenticated

    HTTP Methods:
    - POST: Logout user and blacklist refresh token
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handle POST request for user logout.

        Args:
            request (Request): The incoming request object containing the refresh token.

        Returns:
            Response: Confirmation of successful logout or error message.
        """
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    """
    API View for user profile operations.

    This view handles retrieving and updating user profile information.

    Authentication:
    - JWT Authentication

    Permissions:
    - IsAuthenticated

    HTTP Methods:
    - GET: Retrieve user profile
    - PUT/PATCH: Update user profile
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handle GET request to retrieve user profile.

        Args:
            request (Request): The incoming request object.

        Returns:
            Response: User profile data.
        """
        user_obj = request.user
        data = UserProfileSerialize(user_obj).data
        return Response(data)

    def put(self, request):
        """
        Handle PUT request to update user profile.

        Args:
            request (Request): The incoming request object with updated profile data.

        Returns:
            Response: Confirmation of successful update or error message.
        """
        return self.update_profile(request)

    def patch(self, request):
        """
        Handle PATCH request to partially update user profile.

        Args:
            request (Request): The incoming request object with partial profile data.

        Returns:
            Response: Confirmation of successful update or error message.
        """
        return self.update_profile(request)

    def update_profile(self, request):
        """
        Helper method to update user profile.

        Args:
            request (Request): The incoming request object with profile data.

        Returns:
            Response: Confirmation of successful update or error message.
        """
        try:
            user_obj = request.user
            serializer = UserProfileSerialize(data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.update(user_obj, request.data)
                return Response({'detail': 'Profile updated successfully.'}, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({"message": "Doctor profile does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    API View for changing user password.

    This view handles the process of changing a user's password.

    Authentication:
    - JWT Authentication

    Permissions:
    - IsAuthenticated

    HTTP Methods:
    - POST: Change user password
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handle POST request to change user password.

        Args:
            request (Request): The incoming request object with old and new password.

        Returns:
            Response: Confirmation of successful password change or error message.
        """
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        try:
            user = request.user
            if user.check_password(old_password):
                serializer = ChangePasswordSerializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    user.set_password(new_password)
                    user.is_validate = True
                    user.save()
                    return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Wrong old password"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    """
    API View for sending OTP.

    This view handles the process of sending an OTP to a user's email for verification.

    Permissions:
    - AllowAny

    HTTP Methods:
    - POST: Send OTP to user's email
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request to send OTP.

        Args:
            request (Request): The incoming request object with user's email.

        Returns:
            Response: Confirmation of OTP sent or error message.
        """
        try:
            email = request.data['email']
            sample_otp = 12345  # In production, generate a real OTP
            subject = "OTP from MedAI"
            message = f"Your OTP is: {sample_otp}"

            if User.objects.filter(email=email).exists():
                return Response({"message": "Account already created using this email address"},
                                status=status.HTTP_400_BAD_REQUEST)

            serializer = OTPSerializer(data={"email": email, "otp": sample_otp})
            if serializer.is_valid(raise_exception=True):
                if send_email(email, subject, message):
                    OtpModel.objects.update_or_create(email=email, defaults={'otp': sample_otp})
                    return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Failed to send OTP email"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ForgetPasswordView(APIView):
    """
    API View for handling forgot password requests.

    This view handles the process of resetting a user's password when they've forgotten it.

    Permissions:
    - AllowAny

    HTTP Methods:
    - POST: Reset user's password and send temporary password
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle POST request for forgot password.

        Args:
            request (Request): The incoming request object with user's email.

        Returns:
            Response: Confirmation of password reset or error message.
        """
        try:
            email = request.data['email']
            user = User.objects.get(email=email)

            temp_password = secrets.token_urlsafe(10)
            subject = 'Password for login'
            message = f'Your temporary password is: {temp_password}'

            if send_email(email, subject, message):
                user.set_password(temp_password)
                user.save()
                return Response({
                                    "message": "Your password is successfully recovered. Check your email for the temporary password."})
            return Response({"message": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except User.DoesNotExist:
            return Response({"error": "User does not exist with the given email address"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(APIView):
    """
    API View for Google OAuth login.

    This view handles the process of authenticating users via Google OAuth.

    Permissions:
    - AllowAny

    HTTP Methods:
    - POST: Authenticate user with Google token and return JWT tokens
    """

    permission_classes = [AllowAny]
    GOOGLE_CLIENT_ID = '836345213785-7ahselh9p78a93lu7gofpb07venfcmba.apps.googleusercontent.com'
    SOCIAL_PASSWORD = 'this_is_social_password'

    def post(self, request):
        """
        Handle POST request for Google OAuth login.

        Args:
            request (Request): The incoming request object with Google token.

        Returns:
            Response: JWT tokens if login is successful, error message otherwise.
        """
        try:
            token = request.data.get('google_token')
            response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}')
            userinfo = response.json()

            if response.status_code != 200 or userinfo.get('aud') != self.GOOGLE_CLIENT_ID:
                return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)

            email = userinfo.get('email')
            try:
                user = User.objects.get(email=email)
                if user.is_active:
                    token = get_tokens_for_user(user)
                    return Response(
                        {'refresh': token['refresh'], 'access': token['access'], 'is_doctor': user.is_doctor},
                        status=status.HTTP_200_OK)
            except User.DoesNotExist:
                user_data = {
                    "first_name": userinfo.get('given_name', ''),
                    "last_name": userinfo.get('family_name', ''),
                    "email": email,
                    "password": self.SOCIAL_PASSWORD
                }
                serializer = CreateOAUTHSerializer(data=user_data)
                if serializer.is_valid(raise_exception=True):
                    instance = serializer.save()
                    token = get_tokens_for_user(instance)
                    return Response(
                        {'refresh': token['refresh'], 'access': token['access'], 'is_doctor': instance.is_doctor},
                        status=status.HTTP_201_CREATED)

        except requests.RequestException:
            return Response({'error': 'Failed to validate token with Google'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'message': 'Internal error occurred: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def user_list(request):
    """
    Handles GET requests.

    Retrieves and returns a list of all users in the system.

    Parameters:
    - request: The incoming HTTP request.

    Returns:
    - A Response object with a JSON payload containing the user data.
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=200)