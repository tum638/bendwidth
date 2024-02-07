from django.urls import path
from .views import *

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', login_user),
    path('user-interests/', get_user_interests),
    path('study-partners/', find_study_partners),
    path('find-tutors/', find_tutor),
    path('accept-match/<int:id>', accept_match),
    path('deny-match/<int:id>', reject_match),
    path('get-languages/', get_all_languages),
    path('get-key/', get_key)
]