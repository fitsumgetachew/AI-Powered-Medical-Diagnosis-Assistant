import os
import smtplib
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv

load_dotenv()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def send_email(email , subject , message):

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