from email.message import EmailMessage
import smtplib
import ssl
import time
import asyncio

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "tum1@williams.edu" # Your Gmail email address
EMAIL_HOST_PASSWORD = 'vqbj nzvr yzir wlvi'  # Your Gmail password or app-specific password

async def connect_matches(data, email_interval=300, check_response=60):

    for match in data:
        send_email()
        start = time.time()
        end = start + email_interval
        #send an email every email_interval period
        while time.time() < end:
            #check the database every check_response period
            print("check database")
            time.sleep(60)



def send_email():
    # matching_url = reverse('matching')
    # body = f'http://localhost:8000/{matching_url}/2'
    body = "User _ wants to study with you at 7:00pm. Do you want to accept this invite? <br/><br/> <a href=http://localhost:8000/matching/1><button>Yes</button></a>     <a href=http://localhost:8000/matching/0><button>No</button></a>"
    
    email = EmailMessage()
    email['From'] = EMAIL_HOST_USER
    email['To'] = "ventomilton@gmail.com"
    email['Subject'] = "test subject"
    email.set_content(body, subtype='html')
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        try:
            smtp.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            smtp.sendmail(EMAIL_HOST_USER, "mv9@williams.edu", email.as_string())
        except Exception as e:
            return {"error": str(e)}
    return {"success": True}

