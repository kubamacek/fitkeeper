from rest_framework import viewsets
from .models import Ingredient, MealComponent, Meal, Activity, Training, DailySummary
from .serializers import IngredientSerializer, MealSerializer, MealComponentSerializer, ActivitySerializer, TrainingSerializer, DailySummarySerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class MealComponentViewSet(viewsets.ModelViewSet):
    queryset = MealComponent.objects.all()
    serializer_class = MealComponentSerializer


class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer


class DailySummaryViewSet(viewsets.ModelViewSet):
    queryset = DailySummary.objects.all()
    serializer_class = DailySummarySerializer
