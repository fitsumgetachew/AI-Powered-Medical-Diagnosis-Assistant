from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """
    Custom manager for User model.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.

        Args:
            email (str): The user's email address.
            password (str, optional): The user's password.
            **extra_fields: Additional fields for the user model.

        Raises:
            ValueError: If the email field is not set.

        Returns:
            User: The created user instance.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.

        Args:
            email (str): The superuser's email address.
            password (str, optional): The superuser's password.
            **extra_fields: Additional fields for the superuser model.

        Returns:
            User: The created superuser instance.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that extends AbstractBaseUser and PermissionsMixin.
    """
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_doctor = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        """
        Return the string representation of the user.

        Returns:
            str: The user's email.
        """
        return self.email

class Doctor(models.Model):
    """
    Doctor model that extends from the User model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    years_of_experience = models.PositiveIntegerField(default=0)

    def __str__(self):
        """
        Return the string representation of the doctor.

        Returns:
            str: The doctor's full name.
        """
        return f"Dr. {self.user.first_name} {self.user.last_name}"

class OtpModel(models.Model):
    """
    OTP model for storing email and OTP pairs.
    """
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=20)

    def __str__(self):
        """
        Return the string representation of the OTP model.

        Returns:
            str: The email associated with the OTP.
        """
        return self.email
