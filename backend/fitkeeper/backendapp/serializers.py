from rest_framework import serializers
from .models import Ingredient, MealComponent, Meal, Activity, Training, DailySummary


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'    


class MealComponentSerializer(serializers.ModelSerializer):

    class Meta:
        model = MealComponent
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(MealComponentSerializer, self).to_representation(instance)
        rep['ingredient'] = instance.ingredient.name
        return rep


class MealSerializer(serializers.ModelSerializer):
    meal_components = MealComponentSerializer(many=True)

    class Meta:
        model = Meal
        fields = ['id', 'name', 'day', 'meal_components', 'user']

    def to_representation(self, instance):
        rep = super(MealSerializer, self).to_representation(instance)
        rep['user'] = instance.user.username
        return rep

    def create(self, validated_data):
        meal_components_data = validated_data.pop('meal_components')
        name = validated_data.pop('name')
        day = validated_data.pop('day')
        user = validated_data.pop('user')
        meal = Meal.objects.create(name=name, day=day, user=user)
        for mc in meal_components_data:
            ingredient = Ingredient.objects.get(id=mc.get('ingredient').id)
            meal_component = MealComponent.objects.create(weight=mc.get('weight'), ingredient=ingredient)
            meal.meal_components.add(meal_component)
        return meal

    def update(self, instance, validated_data):
        meal_components_data = validated_data.pop('meal_components')
        instance.name = validated_data.get('name', instance.name)
        instance.day = validated_data.get('day', instance.day)
        instance.user = validated_data.get('user', instance.user)
        instance.meal_components.clear()
        for mc in meal_components_data:
            ingredient = Ingredient.objects.get(id=mc.get('ingredient').id)
            meal_component = MealComponent.objects.get_or_create(ingredient=ingredient, weight=mc.get('weight'))
            instance.meal_components.add(meal_component[0])
        return instance


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(TrainingSerializer, self).to_representation(instance)
        rep['activity'] = instance.activity.name
        rep['user'] = instance.user.username
        return rep


class DailySummarySerializer(serializers.ModelSerializer):
    trainings = TrainingSerializer(many=True)
    meals = MealSerializer(many=True)

    calories_eaten = serializers.SerializerMethodField()
    calories_burned = serializers.SerializerMethodField()

    def get_calories_eaten(self, obj):
        sum = 0
        for meals in obj.meals.all():
            for mc in meals.meal_components.all():
                sum += (mc.weight * mc.ingredient.energy)/100
        return int(sum)

    def get_calories_burned(self, obj):
        sum = 0
        for training in obj.trainings.all():
            sum += (training.duration * training.activity.calories_burned)/60
        return int(sum)

    class Meta:
        model = DailySummary
        fields = '__all__'
