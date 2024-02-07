from rest_framework import generics
from .models import UserProfile, MatchRequest
from .serializers import UserProfileSerializer, MatchRequestSerializer
from .models import UserProfile
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .utils import *

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
    user_id = request.data['userId']
    user_profile = get_object_or_404(UserProfile, user_id=user_id)

    class_year = request.data['classYear']
    gender = request.data['gender']
    major = request.data['major']
    course = request.data['course']
    similar_interests = request.data['matchSimilarInterests']

    if similar_interests:
        # Assuming 'interests' is a comma-separated string of interests
        user_interests = [user_profile.interests]
        other_profiles = UserProfile.objects.exclude(user_id=user_id)
        other_interests = [profile.interests for profile in other_profiles]

        # Combine all interests for vectorization
        all_interests = user_interests + other_interests

        # Vectorize interests
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform(all_interests)

        # Calculate cosine similarity between user and all others
        cosine_similarities = cosine_similarity(vectors[0:1], vectors[1:])

        # Get indices of profiles sorted by similarity (descending)
        similar_indices = cosine_similarities.argsort()[0][::-1]  

        # Convert indices to UserProfile instances, skipping the first index (user themselves)
        best_matches = [other_profiles[int(i)] for i in similar_indices]

    else:
        # Filter based on class_year, gender, major, and course (simplified for demonstration)
        # This assumes these fields are directly comparable and exist on the UserProfile model
        best_matches = UserProfile.objects.filter(
            study_level=class_year,
            gender=gender,
            major=major,
            courses__contains=course 
        ).exclude(id=user_id)

        data = [profile.user.username for profile in best_matches]
        connect_matches(data)
    
    return JsonResponse({"success": True, "matches": data}, safe=False, status=status.HTTP_200_OK)

@api_view(["POST","GET"])
def match_response(request, ans):
    match_data = {
        "status":"accepted" if ans == 1 else "denied",
        "caller_user_id": "test_id1",
        "callee_user_id":"test_id2"
    }
    
    match_serializer = MatchRequestSerializer(data=match_data)
    if match_serializer.is_valid():
        match_serializer.save()
        return HttpResponse("Thank you for your response!")
    else:
        print(match_serializer.errors)
        return HttpResponse("An error occurred! Please respond to this email to confirm your response")

@api_view(["POST"])
def find_tutor(request):
    print(request.data)
