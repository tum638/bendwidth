from email.message import EmailMessage
import smtplib
import ssl
from datetime import timedelta, datetime
import jwt
from django.utils import timezone
from .models import UserProfile, Invitation
from .constants import SECRET_KEY, PASSWORD, USER, EXPIRATION_PERIOD

def generate_jwt_token(receiver_id, uuid):
    """Generates a jwt token to be sent 
    in the link for the receiver.
    """
    print(receiver_id, "RECEIVER ID")
    receiver_profile = UserProfile.objects.get(user_id=receiver_id)
    print(receiver_profile.user.email, "RECEIVER PROFILE")
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
    body = f"""<h4>Hi {receiver_profile.full_name},</h4> 

    <p>Your meeting is scheduled for (some date),
    please use this link to join: 
    
    <br/> <strong><a href="http://localhost:3000/?token={token}">Join Chat</a></strong></p>

    Cheers,
    
    Bendwidth Admin"""

    em = EmailMessage()
    em['From'] = USER
    em['To'] = receiver_profile.user.email
    print(em['To'])
    em['Subject'] = subject
    em.set_content(body, subtype='html')
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        try:
            smtp.login(USER, PASSWORD)
            smtp.sendmail(USER, receiver_profile.user.email, em.as_string())
        except Exception as e:
            return {"error": str(e)}
    return {"success": True}

def handle_invalid_invitation(invitation):
    receivers_list = invitation.receivers.split(",") #get receiver list
    if len(receivers_list) <= 1:
        invitation.delete()
    else:
        #remove receiver with expired invitation
        receivers_list.pop(0)
        invitation.receivers = ",".join(receivers_list)
        invitation.save()

        #send email to the next user
        sender_id = invitation.sender.user.id
        receiver_id = receivers_list[0]
        request_match(sender_id,receiver_id)

def initiate_match(receivers, uuid, sender_id):
    receiver_id = int(receivers[0]) #get first id
    receiver_ids = ",".join(receivers) #stringify ids
    #create new invitation instance
    invitation = Invitation()
    invitation.uuid = uuid
    invitation.sender = UserProfile.objects.get(user_id=sender_id)
    invitation.receivers = receiver_ids
    invitation.save()
    request_match(sender_id, receiver_id)

def batch_processor():
    invitations = Invitation.objects.all()

    for invitation in set(invitations):
        if timezone.now() - invitation.timestamp <= timedelta(minutes=EXPIRATION_PERIOD):
            continue
        handle_invalid_invitation(invitation)

def request_match(sender_id, receiver_id):
    receiver = UserProfile.objects.get(user_id=receiver_id)
    body = f"""<h4>Hi {receiver.full_name},</h4>
    <p>You have received an invitation for a study session in 10 min.
    Do you want to accept this invite? </p>

    <button style="width:100px; height:30px"><a href=http://localhost:8000/accept-match/{sender_id}/{receiver_id}>Accept</a></button> <button style="width:100px;height:30px"><a href=http://localhost:8000/deny-match/{sender_id}/{receiver_id}>Reject</a></button>

    <br/><br/>
    <i>NB: This invitation will expire in {EXPIRATION_PERIOD} minutes.</i>
    <br/><br/>
    <p>Cheers,</p>
    <p>Bendwidth Admin</p>"""
    
    email = EmailMessage()
    email['From'] = USER
    email['To'] = receiver.user.email
    email['Subject'] = "Bendwidth (Time-sensitive!)"
    email.set_content(body, subtype='html')
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        try:
            smtp.login(USER, PASSWORD)
            smtp.sendmail(USER, receiver.user.email, email.as_string())
        except Exception as e:
            return {"error": str(e)}
    return {"success": True}