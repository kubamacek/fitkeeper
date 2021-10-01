from rest_framework import serializers
from .models import User, BMR


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class BMRSerializer(serializers.ModelSerializer):
    """
    Ref for calories in one gram of fat, protein, carbohydrate:
    -> https://www.nal.usda.gov/fnic/how-many-calories-are-one-gram-fat-carbohydrate-or-protein
    """
    calories = serializers.SerializerMethodField()

    def get_calories(self, obj):
        return (9*obj.fat + 4*obj.protein + 4*obj.carbohydrate)

    class Meta:
        model = BMR
        fields = '__all__'
