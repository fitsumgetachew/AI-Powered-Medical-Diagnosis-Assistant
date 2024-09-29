import re
from rest_framework import serializers
from accounts.models import User


def password_validator(value):
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"

    if re.search(pattern , value):
        return value
    else:
        raise serializers.ValidationError("Password must have one capital letter, one small letter, \
        on special characters and one number. length of the password should minimum 8 and maximum 20. ")

def email_unique_validator(value):

    queryset = User.objects.filter(email = value).exists()
    if queryset:
        raise serializers.ValidationError({"email": "user already registered with this email address"})
