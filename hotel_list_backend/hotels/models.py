from django.db import models
from django.contrib.auth.models import User


# class Hotel(models.Model):
#     name = models.CharField(max_length=255)
#     # slug = models.SlugField(unique=True)
#     description = models.TextField()
#     street_address = models.CharField(max_length=255)
#     city = models.CharField(max_length=100)
#     country = models.CharField(max_length=100)
#     zip_code = models.CharField(max_length=20)
#     location = models.CharField(max_length=255)
#     price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
#     available_rooms = models.IntegerField()
#     has_pool = models.BooleanField(default=False)
#     star_rating = models.IntegerField(default=0)



#     def __str__(self):
#         return self.name
    


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel_code = models.CharField(max_length=15, null=False, blank=False)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hotel_code')





    