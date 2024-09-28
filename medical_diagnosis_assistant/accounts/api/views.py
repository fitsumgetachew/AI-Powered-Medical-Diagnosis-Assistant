
from rest_framework.decorators import api_view , permission_classes ,authentication_classes
from rest_framework import permissions, status
from .serializers import CreateUserSerializer, \
    CreateOAUTHSerializer, UserProfileSerialize, \
    OTPSerializer,  ChangePasswordSerializer

from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.models import User, OtpModel

from django.contrib.auth.hashers import check_password
import secrets
from .utils import get_tokens_for_user, send_email
from datetime import timedelta
from django.utils import timezone
import requests
import json

from rest_framework.exceptions import ValidationError


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_account(request):
    try:
        receiver_email = request.data['email']
        print("otp" ,request.data.get('otp' , None))
        if not request.data.get('otp' , None):

            return Response({"message": "verify your email by sending  otp first"}, status=400)

        user_serializer = CreateUserSerializer(data=request.data)

        if user_serializer.is_valid(raise_exception=True):
            try:

                otp_obj = OtpModel.objects.get(email=receiver_email)
            except OtpModel.DoesNotExist:

                return Response({"message": "verify your email by sending  otp first"}, status=400)

            print("data is validated")


            if otp_obj.otp == request.data['otp']:

                instance  = user_serializer.save()

                return Response({"message": "account created successfully"}, status=200)
            else:

                return Response({"message": "enter correct otp"}, status=400)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)

    except Exception as e:
        # Handle any other exceptions
        return Response({"message": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    try:
        email = request.data['email']
        password = request.data['password']
        print(email, password)
        user = User.objects.get(email=email)
        print(user)
        if not check_password(password, user.password):
            print("wrong password ")
            return Response({"password": "wrong password "})

        if user.is_active:
            token = get_tokens_for_user(user)

            return Response({'refresh': token['refresh'],
                             'access': token['access'],
                             'is_doctor':user.is_doctor})
    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)
    except Exception as e:
        print(e)
        return Response(status = 500)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)

        token.blacklist()

        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT' , 'PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    try:
        user_obj = request.user

        if request.method == 'GET':

            data = UserProfileSerialize(user_obj, many = False).data
            return Response(data)

        elif request.method in ['PUT' , 'PATCH']:

            serializer = UserProfileSerialize(data = request.data)

            if serializer.is_valid(raise_exception = True):
                serializer.update(user_obj , request.data)

                return Response(
                    {'detail' : 'Profile updated successfully.'},
                    status= status.HTTP_200_OK
                )
    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):

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





@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_otp(request):
    try:
        email = request.data['email']
        sample_otp = 12345
        subject = "OTP from Tok2dbs"
        message = f"your OTP is: {sample_otp}"

        queryset = User.objects.filter(email=email).exists()
        if queryset:
            return  Response({"message": "Account already created using this email address"}, status=400)

        serializer = OTPSerializer(data={"email": email, "otp": sample_otp})

        if serializer.is_valid(raise_exception=True):

            if send_email(email, subject, message):
                try:

                    instance = OtpModel.objects.get(email=email)

                    instance.otp = sample_otp
                    instance.save()
                except OtpModel.DoesNotExist:

                    serializer.save()

                return Response({"message": "OTP sent successfully"}, status=200)
            else:
                return Response({"message": "Failed to send OTP email"}, status=500)
        return Response({"message": "Invalid data"}, status=400)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)





@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forget_password(request):
    try:
        email = request.data['email']
        user = User.objects.get(email = email)

        if not user:
            return Response("there is no account with a given email address")

        temp_password = secrets.token_urlsafe(10)
        subject = 'Password for login'
        message = f'Your temporary password is: {temp_password}'

        if send_email(email , subject , message):
            user.set_password(temp_password)
            user.save()
            print(temp_password)
            return Response({"You password is successfully recovered , check your email you are received temporary password"})

        return Response(status = 500)


    except User.DoesNotExist:
        return Response({"error": "User does not exist with a given email address"}, status=status.HTTP_400_BAD_REQUEST)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)



GOOGLE_CLIENT_ID = '836345213785-1q2ra0i63cmdbs4jd6cjtro1j9ekcupf.apps.googleusercontent.com'
SOCIAL_PASSWORD = 'this_is_social_password'
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_login(request):
    try:
        # body = json.loads(request.body.decode('utf-8'))
        token = request.data.get('token')

        response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}')
        userinfo = response.json()

        if response.status_code != 200 or userinfo.get('aud') != GOOGLE_CLIENT_ID:
            return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)

        email = userinfo.get('email')
        try:
            user = User.objects.get(email=email)
            if user.is_validate:
                token = get_tokens_for_user(user)
                return Response({'refresh': token['refresh'], 'access': token['access'], 'is_admin':user.is_staff}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            pass

        # If the user does not exist or is not validated, create a new one
        user_data = {
            "first_name": userinfo.get('given_name', ''),
            "last_name": userinfo.get('family_name', ''),
            "email": email,
            "password": SOCIAL_PASSWORD
        }

        serializer = CreateOAUTHSerializer(data=user_data)
        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()

            token = get_tokens_for_user(instance)

            return Response({'refresh': token['refresh'], 'access': token['access'], 'is_admin':instance.is_staff}, status=status.HTTP_201_CREATED)

    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
    except requests.RequestException:
        return Response({'error': 'Failed to validate token with Google'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    except ValidationError as e:
        # Handle the validation error explicitly
        return Response({"message": e.detail}, status=400)

    except Exception as e:
        return Response({'message': 'Internal error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

