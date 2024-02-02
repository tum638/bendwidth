from django.urls import path
from .views import CreateUserView, login_user

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', login_user)
]