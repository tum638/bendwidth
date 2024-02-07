import jwt
import datetime
from .models import UserProfile
from .constants import SECRET_KEY, PASSWORD, USER
from email.message import EmailMessage
import ssl
import smtplib


def generate_jwt_token(receiver_id, uuid):
    """Generates a jwt token to be sent 
    in the link for the receiver.
    """

    receiver_profile = UserProfile.objects.get(id=receiver_id)
    payload = {
        "uuid": uuid,
        "userId": receiver_profile.id,
        "userName": receiver_profile.full_name,
        "isInquirer": False,
        "isRespondent": True,
        "collegeName": receiver_profile.college_name,
        "userEmail": receiver_profile.user.email,
        "gradDate": receiver_profile.grad_date.isoformat(),
        "preferredLanguage": receiver_profile.preferred_language,
        "isLoggedIn": True,
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return send_invitation_link(receiver_profile, token)

def send_invitation_link(receiver_profile, token):
    """Send receiver link to join call. This
    link will contain encoded information that 
    will allow the frontend to know that they are the 
    receiver.
    """
    subject = "[Bendwidth] Meeting invitation link."
    body = f"""Hi {receiver_profile.full_name},

    Your meeting is scheduled for (some date),
    please use this link to join: http://localhost:3000/main/lobby/?token={token}

    Bendwidth Admin"""

    em = EmailMessage()
    em['From'] = receiver_profile.user.email
    em['To'] = receiver_profile.user.email
    em['Subject'] = subject
    em.set_content(body)
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        try:
            smtp.login(USER, PASSWORD)
            smtp.sendmail(USER, receiver_profile.user.email, em.as_string())
        except Exception as e:
            return {"error": str(e)}
    return {"success": True}

