from django.urls import path
from . import views


app_name = 'profiles'

urlpatterns = [
    path('login/', views.LoginPage.as_view(template_name = 'profiles/login.html'), name='login'),
    path('register/', views.RegisterPage.as_view(template_name = 'profiles/register.html'), name='register'),
    path('logout/', views.LogoutPage.as_view(template_name = 'profiles/login.html'), name='logout'),
]