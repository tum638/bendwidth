from django.urls import path
from .views import CreateUserView, login_user, get_user_interests, find_study_partners, find_tutor, get_all_languages, get_key

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', login_user),
    path('user-interests/', get_user_interests),
    path('study-partners/', find_study_partners),
    path('find-tutors/', find_tutor),
    path('get-languages/', get_all_languages),
    path('get-key/', get_key)
]