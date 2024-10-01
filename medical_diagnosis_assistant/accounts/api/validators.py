import re
from rest_framework import serializers
from accounts.models import User

def password_validator(value):
    """
    Validate the password against specific criteria.

    Args:
        value (str): The password to validate.

    Returns:
        str: The validated password.

    Raises:
        serializers.ValidationError: If the password doesn't meet the criteria.
    """
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"

    if re.match(pattern, value):
        return value
    else:
        raise serializers.ValidationError(
            "Password must have one capital letter, one small letter, "
            "one special character, and one number. Length should be between 8 and 20 characters."
        )

def email_unique_validator(value):
    """
    Validate that the email is unique in the User model.

    Args:
        value (str): The email to validate.

    Raises:
        serializers.ValidationError: If a user with the given email already exists.
    """
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("User already registered with this email address")
