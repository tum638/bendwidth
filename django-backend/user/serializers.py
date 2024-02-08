from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ['full_name', 'email', 'password', 'password2', 'college_name', 'major', 
                  'study_level', 'country', 'courses', 'age', 'gender', 'interests', 
                  'skills', 'hobbies', 
                  'preferred_language',
                 'grad_date'
                  ]

    def create(self, validated_data):
        # Separate user data
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        password2 = validated_data.pop('password2')

        # Check if both passwords match
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})

        user = User.objects.create_user(username=email, email=email, password=password)
        user_profile = UserProfile.objects.create(user=user, **validated_data)
        return user_profile

