from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.CreateAccountView.as_view(), name='create_account'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change_password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('send_otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('forget_password/', views.ForgetPasswordView.as_view(), name='forget-password'),
    path('google_auth/', views.GoogleLoginView.as_view(), name='google-auth'),
    path('list/', views.user_list, name='user-list'),

]