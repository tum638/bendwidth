from django.db import models
from django.contrib.auth.models import User
from .constants import LOCALES_BCP_47

# Model to store additional user information
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Additional fields based on your form
    full_name = models.CharField(max_length=255)
    college_name = models.CharField(max_length=255)
    major = models.CharField(max_length=255)
    study_level = models.CharField(max_length=50)  # Freshman, Sophomore, etc.
    country = models.CharField(max_length=100)
    courses = models.TextField()  # Assuming this can be a long text
    age = models.IntegerField()
    gender = models.CharField(max_length=50)
    interests = models.TextField()
    skills = models.TextField()
    hobbies = models.TextField()
    preferred_language = models.CharField(max_length=50, choices=LOCALES_BCP_47, default="en-US")
    is_tutor = models.BooleanField(default=None, blank=True, null=True)
    is_student = models.BooleanField(default=None, blank=True, null=True)

    def __str__(self):
        return self.user.username
