from accounts.models import User ,OtpModel
from rest_framework import serializers
from .validators import email_unique_validator , password_validator


class CreateOAUTHSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'password'
        ]


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators = [email_unique_validator ,])
    confirm_password = serializers.CharField(write_only = True)
    otp = serializers.CharField(write_only = True)
    password = serializers.CharField(validators = [password_validator])


    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'otp',
            'password',
            'confirm_password',
            'is_doctor'
        ]

    def create(self, validated_data):
        # Remove fields not required for User creation
        validated_data.pop('confirm_password')
        validated_data.pop('otp')

        # Create the user with the remaining data
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerialize(serializers.ModelSerializer):

    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name' ,
            'email',
            'profile_picture',

        ]
        read_only_fields = [
            'email',
        ]
    def get_profile_picture(self ,obj):

        if hasattr(obj, 'profile_picture') and obj.profile_picture:
            return obj.profile_picture.url
        return None


    def update(self, instance, validated_data ):
        print("update is called")


        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class OTPSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = OtpModel
        fields = ['email' , 'otp']


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()
    new_password = serializers.CharField(validators = [password_validator])
    confirm_password = serializers.CharField()

    def validate(self , data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        return data
