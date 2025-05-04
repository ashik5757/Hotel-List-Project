import requests
from hotel_lister.utils.auth import generate_signature, get_amadeus_client
from amadeus import ResponseError, Location, Hotel
import requests
from django.conf import settings



def search_hotels_by_city(city_code, radius=5, radiusUnit="KM", amenities=[], ratings=None):

    amadeus = get_amadeus_client()
    try:
        
        if ratings is None or not ratings:
            response = amadeus.reference_data.locations.hotels.by_city.get(
                cityCode=city_code,
                radius=radius,
                radiusUnit=radiusUnit,
                amenities=amenities
            )

        else:
            response = amadeus.reference_data.locations.hotels.by_city.get(
                cityCode=city_code,
                radius=radius,
                radiusUnit=radiusUnit,
                amenities=amenities,
                ratings=ratings
            )

        return response.data
    
    except Exception as e:
        # Handle error appropriately
        return {'error': str(e)}
    


def search_hotels_by_id(hotel_id):

    # api_key = settings.HOTELBEDS_API_KEY
    # secret = settings.HOTELBEDS_SECRET
    # signature, timestamp = generate_signature(api_key, secret)
    # print(signature)

    amadeus = get_amadeus_client()

    try:
        # response = amadeus.reference_data.locations.hotels.by_hotels.get(
        #     hotelIds=[hotel_id],
        # )

        response = amadeus.shopping.hotel_offers_search.get(
            hotelIds=[hotel_id]
        )

        return response.data
    
    except Exception as e:
        return {'error': str(e)}
    



def search_hotels_by_geocode(latitude, longitude, radius=5, radiusUnit="KM", amenities=[], ratings=None):

    amadeus = get_amadeus_client()

    try:
                
        if ratings is None or not ratings:
            response = amadeus.reference_data.locations.hotels.by_geocode.get(
                latitude=latitude,
                longitude=longitude,
                radius=radius,
                radiusUnit=radiusUnit,
                amenities=amenities
            )

        else:
            response = amadeus.reference_data.locations.hotels.by_geocode.get(
                latitude=latitude,
                longitude=longitude,
                radius=radius,
                radiusUnit=radiusUnit,
                amenities=amenities,
                ratings=ratings
            )


        return response.data
    
    except Exception as e:
        return {'error': str(e)}



def bookmark_hotel(hotel_id, user_id):
    pass



def search_hotels_by_name(name):    
    pass





def fetch_hotels_by_location(location):
    api_key = settings.HOTELBEDS_API_KEY
    secret = settings.HOTELBEDS_SECRET
    signature, timestamp = generate_signature(api_key, secret)

    headers = {
        'Api-Key': api_key,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    payload = {
        "stay": {
            "checkIn": "2025-05-01",
            "checkOut": "2025-05-03"
        },
        "occupancies": [
            {
                "rooms": 1,
                "adults": 1,
                "children": 0
            }
        ],
        "destination": {
            "code": location,
            "type": "CITY"
        }
    }

    try:
        response = requests.post(
            # 'https://api.test.hotelbeds.com/hotel-api/1.0/hotels',
            'https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels',
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}




class HotelDataAPI:

    BASE_URL = "" 
    API_KEY = ""

    @staticmethod
    def get_hotel_data(data):

        city = data.get("city")
        checkin_date = data.get("checkin_date")
        checkout_date = data.get("checkout_date")
        guests = data.get("guests")


        url = f"{HotelDataAPI.BASE_URL}/hotels?city={city}&checkin_date={checkin_date}&checkout_date={checkout_date}&guests={guests}"
        headers = {
            "Authorization": f"Bearer {HotelDataAPI.API_KEY}"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            return None
        
    




    def get_hotel_details(hotel_id):

        url = "https://demandapi.booking.com/3.1/accommodations/search"

        payload = {
        "booker": {
            "country": "nl",
            "platform": "desktop"
        },
        "checkin": "!START_DATE!",
        "checkout": "!END_DATE!",
        "city": -2140479,
        "extras": [
            "extra_charges",
            "products"
        ],
        "guests": {
            "number_of_adults": 2,
            "number_of_rooms": 1
        }
        }

        headers = {
        "Content-Type": "application/json",
        "X-Affiliate-Id": "0",
        "Authorization": "Bearer <YOUR_string_HERE>"
        }

        response = requests.post(url, json=payload, headers=headers)

        data = response.json()
        print(data)