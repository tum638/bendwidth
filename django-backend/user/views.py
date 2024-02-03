from rest_framework import generics
from .models import UserProfile
from .serializers import UserProfileSerializer
from .models import UserProfile
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from rest_framework import status
from django.http import JsonResponse

class CreateUserView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

@api_view(["POST"])
def login_user(request):
    print(request.data)
    username = request.data["email"]
    password = request.data["password"]
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        user_profile = UserProfile.objects.get(user = user.id)
        return JsonResponse({
            "success": True, 
            "full_name": user_profile.full_name,
            "college_name": user_profile.college_name,
            "user_id": user_profile.id
            }, status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Invalid login."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def get_user_interests(request):
    print(request.data)
    try:
        profile = UserProfile.objects.all().first()
        print(profile.id)
        user_profile = UserProfile.objects.get(id = request.data["userId"])
        user_profile.interests = ",".join(request.data["interests"])
        user_profile.save()
        return JsonResponse({"success": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def find_study_partners(request):
    print(request.data)

@api_view(["POST"])
def find_tutor(request):
    print(request.data)

    
