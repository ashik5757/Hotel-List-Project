from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Bookmark
import re

class UserSerializer(serializers.ModelSerializer):

    username = serializers.CharField(required=True, max_length=8, min_length=4, allow_blank=False, allow_null=False)
    email = serializers.EmailField(required=True, allow_blank=False, allow_null=False, max_length=100)
    password = serializers.CharField(write_only=True, required=True, max_length=15)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        # extra_kwargs = {'password': {'write_only': True}}
    

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password']
        )

        return user


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(required=True, max_length=8, min_length=4, allow_blank=False, allow_null=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']


    def validate(self, data):

        user = authenticate(username=data['username'], password=data['password'])
        print(user)
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")
        # if not user.is_authenticated:
        #     raise serializers.ValidationError("User is not authenticated.")
        return user
        


class BookmarkSerializer(serializers.ModelSerializer):

    hotel_code = serializers.CharField(required=True, max_length=15)

    class Meta:
        model = Bookmark
        fields = ['hotel_code', 'date_added']
        read_only_fields = ['date_added']

    def validate(self, data):
        if not data.get('hotel_code') :
            raise serializers.ValidationError("Hotel code is required.")
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        print(validated_data)

        bookmark = Bookmark.objects.create(**validated_data)

        return bookmark