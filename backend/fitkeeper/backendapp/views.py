from rest_framework import viewsets
from .models import Ingredient, Meal, Activity, Training, DailySummary
from .serializers import IngredientSerializer, MealSerializer, ActivitySerializer, TrainingSerializer, DailySummarySerializer


class IngredientView(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class MealView(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer


class ActivityView(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class TrainingView(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer


class DailySummaryView(viewsets.ModelViewSet):
    queryset = DailySummary.objects.all()
    serializer_class = DailySummarySerializer
