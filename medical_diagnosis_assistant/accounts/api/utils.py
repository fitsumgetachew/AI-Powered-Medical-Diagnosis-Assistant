import os
import smtplib
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv

load_dotenv()

def get_tokens_for_user(user):
    """
    Generate JWT tokens for a given user.

    Args:
        user (User): The user object for which to generate tokens.

    Returns:
        dict: A dictionary containing 'refresh' and 'access' tokens.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def send_email(email, subject, message):
    """
    Send an email using SMTP.

    Args:
        email (str): The recipient's email address.
        subject (str): The subject of the email.
        message (str): The body of the email.

    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """

    smtp_server = os.getenv('MAIL_SERVER')
    smtp_port = 587
    sender_email = os.getenv('MAIL_USERNAME')
    sender_password = os.getenv('MAIL_PASSWORD')

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, f'Subject: {subject}\n\n{message}')
        server.quit()
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False