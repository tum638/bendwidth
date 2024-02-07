from django.db import models
from django.contrib.auth.models import User
from .constants import LOCALES_BCP_47, LANGUAGE_CODES

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
    preferred_language = models.CharField(max_length=50, choices=LANGUAGE_CODES, default="en")
    is_tutor = models.BooleanField(default=None, blank=True, null=True)
    is_student = models.BooleanField(default=None, blank=True, null=True)
    grad_date = models.DateField()
    
    def __str__(self):
        return self.user.username
    
class Invitation(models.Model):
    STATUS = [
        (0, "pending"),
        (1, "denied"),
        (2, "accepted")
        ]
    status = models.CharField(max_length=50, default="pending", choices=STATUS)
    uuid = models.CharField(max_length = 200)
    sender = models.ForeignKey(UserProfile, max_length=100, related_name="invitations", on_delete=models.DO_NOTHING)
    receivers = models.CharField(max_length=50) # string with list of potential receivers id's.
    timestamp = models.DateTimeField(auto_now=True)
