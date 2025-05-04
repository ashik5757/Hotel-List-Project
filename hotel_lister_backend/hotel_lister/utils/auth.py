import hashlib
import time
from amadeus import Client, ResponseError
from django.conf import settings



def generate_signature(api_key, secret):
    timestamp = str(int(time.time()))
    raw_signature = api_key + secret + timestamp
    signature = hashlib.sha256(raw_signature.encode('utf-8')).hexdigest()
    return signature, timestamp



def get_amadeus_client():
    return Client(
        client_id=settings.AMADEUS_CLIENT_ID,
        client_secret=settings.AMADEUS_CLIENT_SECRET
    )