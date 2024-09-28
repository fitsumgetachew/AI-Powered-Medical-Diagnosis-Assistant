from django.urls import path
from . import views
urlpatterns =[
    path('register/' , views.create_account , name='create_account'),
    path('login/' , views.login , name= 'login'),
    path('logout/' , views.logout , name= 'logout'),
    path('profile/' , views.user_profile , name = 'profile'),
    path('change_password/' , views.change_password , name ='change-password'),
    path('send_otp/' , views.send_otp),
    path('forget_password/' , views.forget_password),
    path('google_auth/' , views.google_login),
    ]