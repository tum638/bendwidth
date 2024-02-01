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
            }, status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Invalid login."}, status=status.HTTP_401_UNAUTHORIZED)

