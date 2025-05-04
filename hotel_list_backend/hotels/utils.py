import requests
from hotel_lister.utils.auth import generate_signature, get_amadeus_client
from amadeus import ResponseError, Location, Hotel
import requests
from django.conf import settings

HOTELBEDS_API_VERSION = 1.0
HOTELBEDS_HOTEL_API_URL = f"https://api.test.hotelbeds.com/hotel-api/{HOTELBEDS_API_VERSION}/hotels"
HOTELBEDS_HOTEL_CONTENT_API_URL = f"https://api.test.hotelbeds.com/hotel-content-api/{HOTELBEDS_API_VERSION}/hotels"
HOTELBEDS_HOTEL_BOOKING_API_URL = f"https://api.test.hotelbeds.com/hotel-api/{HOTELBEDS_API_VERSION}/hotels"



def fetch_all_hotels():
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)


    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    params = {
        "from": 1,
        "to": 10
    }

    try:
        response = requests.get(
            HOTELBEDS_HOTEL_CONTENT_API_URL,
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}



def fetch_hotels_by_hotelIDs(hotel_ids):
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)
    print(api_key)
    print(signature)

    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    params = {
        "codes": [hotel_ids]
    }

    try:
        response = requests.get(
            HOTELBEDS_HOTEL_CONTENT_API_URL,
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}




def fetch_hotels_by_location(location_code, fromID=1, toID=10):
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)
    print(api_key)
    print(signature)

    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    params = {
        "destinationCode": location_code,
        "from": fromID,
        "to": toID
    }

    try:
        response = requests.get(
            HOTELBEDS_HOTEL_CONTENT_API_URL,
            headers=headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}




def fetch_hotels_availability(hotel_ids, check_in, check_out, rooms=1, adults=1, children=0, minRate=1, maxRate=1000, minCategory=1, maxCategory=5, maxRooms=5, maxRatesPerRoom=5):
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)

    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }


    body_schema = {
    
            "stay": {
                "checkIn": check_in,
                "checkOut": check_out
            },
            "occupancies": [
                {
                "rooms": rooms,
                "adults": adults,
                "children": children
                }
            ],

            # "accommodations": [
            #     "H",
            #     "S"
            # ],

            "hotels": {
                "hotel": hotel_ids
            },


            "filter": {
                "minRate": minRate,
                "maxRate": maxRate,
                "minCategory": minCategory,
                "maxCategory": maxCategory,
                "maxRooms": maxRooms,
                "maxRatesPerRoom": maxRatesPerRoom
            }
        
    }

    try:
        response = requests.post(
            HOTELBEDS_HOTEL_BOOKING_API_URL,
            headers=headers,
            json=body_schema
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}





def fetch_hotel_details(hotel_id):
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)


    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    # params = {
    #     "code": [hotel_id]
    # }

    try:
        response = requests.get(
            # f'https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/{hotel_id}',
            f'{HOTELBEDS_HOTEL_CONTENT_API_URL}/{hotel_id}/details',
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}
    







