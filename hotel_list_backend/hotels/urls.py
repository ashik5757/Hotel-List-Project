from django.urls import path
from .import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.HomepageView, name='homepage'),
    path('hotels/all/', views.HotelListView.as_view(), name='hotel_list_api'),
    path('bookmarks/', views.BookmarkListView.as_view(), name='bookmark_list'),
    path('bookmarks/search/', views.BookmarkDetailsListView.as_view(), name='details_bookmark_api'),


    path('accounts/signup/', views.SignUpAPIView.as_view(), name='signup_api'),
    path('accounts/login/', views.LoginAPIVIew.as_view(), name='login_api'),
    path('accounts/logout/', views.LogoutAPIView.as_view(), name='logout_api'),

    path('hotels-details/', views.HotelDetailsView.as_view(), name='hotels_deatails_api'),
    path('hotels/search/', views.HotelSearchView.as_view(), name='hotels_search_api'),



    # path('search-hotels/', views.HotelSearchView.as_view(), name='hotels_search_api'),
    # path('hotels-details/', views.HotelDetailsView.as_view(), name='hotels_deatails_api'),
    # path('search-hotels-geocode/', views.HotelSearchByGeocodeView.as_view(), name='hotels_search_geocode_api'),

 
]