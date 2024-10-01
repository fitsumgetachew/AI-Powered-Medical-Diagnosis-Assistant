from rest_framework import serializers
from accounts.models import User, OtpModel, Doctor
from .validators import email_unique_validator, password_validator

class CreateOAUTHSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a user account via OAuth.
    """

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

class CreateUserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user account, including doctor-specific fields.
    """
    email = serializers.EmailField(validators=[email_unique_validator])
    confirm_password = serializers.CharField(write_only=True)
    otp = serializers.CharField(write_only=True)
    password = serializers.CharField(validators=[password_validator])

    # Doctor specific fields
    specialization = serializers.CharField(write_only=True, required=False)
    license_number = serializers.CharField(write_only=True, required=False)
    years_of_experience = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'otp', 'password', 'confirm_password',
            'is_doctor', 'specialization', 'license_number', 'years_of_experience'
        ]

    def validate(self, data):
        """
        Validate the data, ensuring doctor-specific fields are provided if the user is a doctor.
        """
        if data.get('is_doctor'):
            if not all([data.get('specialization'), data.get('license_number'), data.get('years_of_experience')]):
                raise serializers.ValidationError("Doctor details are required for doctor registration.")
        return data

    def create(self, validated_data):
        """
        Create and return a new User instance, given the validated data.
        """
        validated_data.pop('confirm_password')
        validated_data.pop('otp')

        doctor_data = {}
        if validated_data.get('is_doctor'):
            doctor_data['specialization'] = validated_data.pop('specialization')
            doctor_data['license_number'] = validated_data.pop('license_number')
            doctor_data['years_of_experience'] = validated_data.pop('years_of_experience')

        user = User.objects.create_user(**validated_data)

        if user.is_doctor:
            Doctor.objects.create(user=user, **doctor_data)

        return user

class DoctorProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor profile information.
    """
    class Meta:
        model = Doctor
        fields = ['specialization', 'license_number', 'years_of_experience']

class UserProfileSerialize(serializers.ModelSerializer):
    """
    Serializer for user profile information, including doctor-specific data if applicable.
    """
    profile_picture = serializers.SerializerMethodField()
    doctor_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_picture', 'doctor_profile']
        read_only_fields = ['email']

    def get_profile_picture(self, obj):
        """
        Get the URL of the user's profile picture if it exists.
        """
        if hasattr(obj, 'profile_picture') and obj.profile_picture:
            return obj.profile_picture.url
        return None

    def get_doctor_profile(self, obj):
        """
        Get the doctor profile data if the user is a doctor.
        """
        if obj.is_doctor:
            doctor_profile = Doctor.objects.get(user=obj)
            return DoctorProfileSerializer(doctor_profile).data
        return None

    def update(self, instance, validated_data):
        """
        Update and return an existing User instance, given the validated data.
        """
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()

        if instance.is_doctor and 'doctor_profile' in validated_data:
            doctor_data = validated_data.pop('doctor_profile')
            Doctor.objects.update_or_create(user=instance, defaults=doctor_data)

        return instance

class OTPSerializer(serializers.ModelSerializer):
    """
    Serializer for OTP (One-Time Password) data.
    """
    email = serializers.EmailField()

    class Meta:
        model = OtpModel
        fields = ['email', 'otp']

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[password_validator])
    confirm_password = serializers.CharField()

    def validate(self, data):
        """
        Validate that the new password and confirm password match.
        """
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        return data
