from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout
from django.db import IntegrityError
from .models import Bookmark
from .serializers import UserSerializer, LoginSerializer, BookmarkSerializer
from .utils import fetch_all_hotels, fetch_hotel_details, fetch_hotels_by_location, fetch_hotels_availability, fetch_hotels_by_hotelIDs
from datetime import datetime, timedelta



def HomepageView(request):
    return render(request, 'index.html')

# def HotelListView(request):
#     return render(request, 'hotel_list.html')

# def BookmarkListView(request):
#     return render(request, 'bookmark_list.html')


class SignUpAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializar = UserSerializer(data=request.data)
        # print(request)
        if serializar.is_valid():
            serializar.save()
            return Response(serializar.data, status=status.HTTP_201_CREATED)
        return Response(serializar.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIVIew(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_200_OK)
            # token, craeted = Token.objects.get_or_create(user=user)
            # return Response({'token': token.key}, status=status.HTTP_200_OK)        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):

    def post(self, request):
        # try:
        if request.user.is_authenticated:
            
            refresh_token = request.data.get('refresh')
            if refresh_token is None:
                return Response({"error":"Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                logout(request)
                return Response({"message":"You have been logged out successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"User Not Authenticated"}, status=status.HTTP_400_BAD_REQUEST)
        # except Exception as e:
        #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






# HotelBeds API


class HotelListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        hotels_json = fetch_all_hotels()
        if "error" in hotels_json:
            return Response({"error": hotels_json["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        all_hotels_list = hotels_json['hotels']

        all_hotels = []

        for hotel in all_hotels_list:

            hotel_rating = hotel.get('S2C','N/A')
            email = hotel.get('email', 'N/A')


            # all_hotels.append({
            #     'name': hotel['name']['content'],
            #     'description': hotel['description']['content'],
            #     'countryCode': hotel['countryCode'],
            #     'address': hotel['address']['content'],
            #     'city': hotel['city']['content'],
            #     'email': email,
            #     'latitude': hotel['coordinates']['latitude'],
            #     'longitude': hotel['coordinates']['longitude'],
            #     'hotel_id': hotel['code'],
            #     'rating': hotel_rating,
            # })            
        
        return Response(hotels_json, status=status.HTTP_200_OK)



class HotelDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hotel_id = request.query_params.get('hotel_id')
        if not hotel_id:
            return Response({'error': 'Hotel ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        hotel = fetch_hotel_details(hotel_id)
        if "error" in hotel:
            return Response({"error": hotel["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(hotel, status=status.HTTP_200_OK)




class HotelSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        location_code = request.query_params.get("location_code")
        next_page = request.query_params.get("next_page", 1)
        check_in = request.query_params.get("check_in")
        check_out = request.query_params.get("check_out")
        rooms = request.query_params.get("rooms", 1)
        adults = request.query_params.get("adults", 1)
        children = request.query_params.get("children", 0)
        minRate = request.query_params.get("minRate", 0)
        maxRate = request.query_params.get("maxRate", 1000)
        minCategory = request.query_params.get("minCategory", 1)
        maxCategory = request.query_params.get("maxCategory", 5)
        maxRooms = request.query_params.get("maxRooms", 5)
        maxRatesPerRoom = request.query_params.get("maxRatesPerRoom", 5)



        if not location_code:
            return Response({"error": "Location parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not next_page:
            
            toID = next_page * 10
            fromID = toID - 9

            hotels_json = fetch_hotels_by_location(location_code=location_code, fromID=fromID, toID=toID)
        else:
            hotels_json = fetch_hotels_by_location(location_code=location_code, fromID=1, toID=10)


        if "error" in hotels_json:
            return Response({"error": hotels_json["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
        hotels_list = hotels_json['hotels']
        
        if not hotels_list or len(hotels_list) == 0:
            return Response({"error": "No hotels found for the given location."}, status=status.HTTP_404_NOT_FOUND)
        
        hotel_codes = [hotel['code'] for hotel in hotels_list]
        all_hotels = []



        if not check_in or not check_out:
            check_in = datetime.now().strftime('%Y-%m-%d')
            check_out = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
        
        if not rooms:
            rooms = 1
        if not adults:
            adults = 1
        if not children:
            children = 0
        if not minRate:
            minRate = 0
        if not maxRate:
            maxRate = 1000
        if not minCategory:
            minCategory = 1
        if not maxCategory:
            maxCategory = 5
        if not maxRooms:
            maxRooms = 5
        if not maxRatesPerRoom:
            maxRatesPerRoom = 5
        





        hotel_available_json = fetch_hotels_availability(
            hotel_ids=hotel_codes, 
            check_in=check_in, 
            check_out=check_out, 
            rooms=rooms, 
            adults=adults, 
            children=children,
            minRate=minRate,
            maxRate=maxRate,
            minCategory=minCategory,
            maxCategory=maxCategory,
            maxRooms=maxRooms,
            maxRatesPerRoom=maxRatesPerRoom)
        

        if "error" in hotel_available_json:
            return Response({"error": hotel_available_json["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        if not hotel_available_json or len(hotel_available_json['hotels']) == 0:
            return Response({"error": "No hotels available for the given location."}, status=status.HTTP_404_NOT_FOUND)
        
        

        all_hotels_availble = hotel_available_json['hotels']['hotels']



        for hotel in all_hotels_availble:
            hotel_code = hotel['code']
            hotel_name = hotel.get('name', 'N/A')
            hotel_data = next((x for x in hotels_list if x['code'] == hotel_code), {})
            hotel_description = hotel_data.get('description', {}).get('content', 'N/A')
            hotel_address = hotel_data.get('address', {}).get('content', 'N/A')
            hotel_city = hotel.get('destinationName', 'N/A')
            hotel_country = hotel_data.get('countryCode', 'N/A')
            hotel_min_rate = hotel.get('minRate', 0)
            hotel_max_rate = hotel.get('maxRate', 0)
            hotel_avg_price_rate = (float(hotel_min_rate) + float(hotel_max_rate)) / 2
            hotel_rating_s2c = hotel_data.get('S2C', 'N/A')
            hotel_rating = hotel.get('categoryName', 'N/A')
            currancy = hotel.get('currency', 'N/A')



            all_hotels.append({
                'hotel_id': hotel_code,
                'name': hotel_name,
                'description': hotel_description,
                'countryCode': hotel_country,
                'address': hotel_address,
                'city': hotel_city,
                'rating': hotel_rating,
                'rating_s2c': hotel_rating_s2c,
                'avg_price_rate': hotel_avg_price_rate,
                'currency': currancy,
            })


        return Response(all_hotels, status=status.HTTP_200_OK)




class BookmarkDetailsListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        all_bookmarks = Bookmark.objects.filter(user=request.user).order_by('-date_added')
        if not all_bookmarks.exists():
            return Response({"message": "No bookmarks found."}, status=status.HTTP_404_NOT_FOUND)
        


        hotel_ids = [bookmark.hotel_code for bookmark in all_bookmarks]
        if not hotel_ids:
            return Response({'error': 'Atleast one Hotel-ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        hotels_json = fetch_hotels_by_hotelIDs(hotel_ids)
        if "error" in hotels_json:
            return Response({"error": hotels_json["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


        hotels_list = hotels_json['hotels']
        
        if not hotels_list or len(hotels_list) == 0:
            return Response({"error": "No hotels found for the given Ids."}, status=status.HTTP_404_NOT_FOUND)
        
        hotel_codes = [hotel['code'] for hotel in hotels_list]
        all_hotels = []


        check_in = datetime.now().strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
    


        hotel_available_json = fetch_hotels_availability(
            hotel_ids=hotel_codes, 
            check_in=check_in, 
            check_out=check_out)
        

        if "error" in hotel_available_json:
            return Response({"error": hotel_available_json["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        if not hotel_available_json or len(hotel_available_json['hotels']) == 0:
            return Response({"error": "No hotels available for the given Ids."}, status=status.HTTP_404_NOT_FOUND)
        
        

        all_hotels_availble = hotel_available_json['hotels']['hotels']



        for hotel in all_hotels_availble:
            hotel_code = hotel['code']
            hotel_name = hotel.get('name', 'N/A')
            hotel_data = next((x for x in hotels_list if x['code'] == hotel_code), {})
            hotel_description = hotel_data.get('description', {}).get('content', 'N/A')
            hotel_address = hotel_data.get('address', {}).get('content', 'N/A')
            hotel_city = hotel.get('destinationName', 'N/A')
            hotel_country = hotel_data.get('countryCode', 'N/A')
            hotel_min_rate = hotel.get('minRate', 0)
            hotel_max_rate = hotel.get('maxRate', 0)
            hotel_avg_price_rate = (float(hotel_min_rate) + float(hotel_max_rate)) / 2
            hotel_rating_s2c = hotel_data.get('S2C', 'N/A')
            hotel_rating = hotel.get('categoryName', 'N/A')
            currancy = hotel.get('currency', 'N/A')
            date_added = None
            try:
                date_added = all_bookmarks.get(hotel_code=hotel_code).date_added
            except Bookmark.DoesNotExist:
                date_added = None


            all_hotels.append({
                'hotel_id': hotel_code,
                'date_added': date_added,
                'name': hotel_name,
                'description': hotel_description,
                'countryCode': hotel_country,
                'address': hotel_address,
                'city': hotel_city,
                'rating': hotel_rating,
                'rating_s2c': hotel_rating_s2c,
                'avg_price_rate': hotel_avg_price_rate,
                'currency': currancy,
            })


        return Response(all_hotels, status=status.HTTP_200_OK)





class BookmarkListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).order_by('-date_added')
        if not bookmarks.exists():
            return Response({"message": "No bookmarks found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = BookmarkSerializer(data=request.data, context={'request': request}) 
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({"error": "Bookmark already exists."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request):
        hotel_code = request.data.get('hotel_code')
        if not hotel_code:
            return Response({"error": "Hotel code is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            bookmark = Bookmark.objects.get(user=request.user, hotel_code=hotel_code)
            bookmark.delete()
            return Response({"message": "Bookmark deleted successfully."}, status=status.HTTP_200_OK)
        except Bookmark.DoesNotExist:
            return Response({"error": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

    








# class HotelSearchView(APIView):
#     def get(self, request):
#         location = request.query_params.get("location")
#         if not location:
#             return Response({"error": "Location parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

#         hotels = fetch_hotels_by_location(location)

#         all_hotels = hotels['hotels']['hotels']

#         # for hotel in all_hotels:

#         # print(len(hotels['hotels']['hotels']))
#         print(all_hotels[0])

#         if "error" in hotels:
#             return Response({"error": hotels["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(hotels, status=status.HTTP_200_OK)














# Amedeus API
# class HotelSearchView(APIView):
#     def get(self, request):
#         city_code = request.query_params.get('city_code')
#         radius = request.query_params.get('radius', 5)
#         radiusUnit = request.query_params.get('radiusUnit', 'KM')
#         amenities = request.query_params.get('amenities', [])
#         ratings = request.query_params.get('ratings')
#         # latitude = request.query_params.get('latitude')
#         # longitude = request.query_params.get('longitude')

#         print(city_code, radius, radiusUnit, amenities, ratings)

#         if not city_code:
#             return Response({'error': 'City Code is required.'}, status=status.HTTP_400_BAD_REQUEST)

#         if not radius:
#             radius = 5
#         if not radiusUnit:
#             radiusUnit = 'KM'
#         if not amenities:
#             amenities = []

        
        
#         hotels = search_hotels_by_city(city_code, radius, radiusUnit, amenities, ratings)
#         if "error" in hotels:
#             return Response({"error": hotels["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(hotels, status=status.HTTP_200_OK)


# class HotelSearchByGeocodeView(APIView):
#     def get(self, request):
#         latitude = request.query_params.get('latitude')
#         longitude = request.query_params.get('longitude')
#         radius = request.query_params.get('radius', 5)
#         radiusUnit = request.query_params.get('radiusUnit', 'KM')
#         amenities = request.query_params.get('amenities', [])
#         ratings = request.query_params.get('ratings')


#         print(latitude, longitude, radius, radiusUnit, amenities, ratings)

#         if not latitude or not longitude:
#             return Response({'error': 'Latitude and Longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)

#         if not radius:
#             radius = 5
#         if not radiusUnit:
#             radiusUnit = 'KM'
#         if not amenities:
#             amenities = []

        
#         hotels = search_hotels_by_geocode(latitude, longitude, radius, radiusUnit, amenities, ratings)
#         if "error" in hotels:
#             return Response({"error": hotels["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(hotels, status=status.HTTP_200_OK)





# class HotelDetailsView(APIView):
#     def get(self, request):
#         hotel_id = request.query_params.get('hotel_id')
#         if not hotel_id:
#             return Response({'error': 'Hotel ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

#         hotel = search_hotels_by_id(hotel_id)
#         if "error" in hotel:
#             return Response({"error": hotel["error"]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         return Response(hotel, status=status.HTTP_200_OK)
    















