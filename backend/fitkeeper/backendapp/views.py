from rest_framework import viewsets
from .models import Ingredient, Meal, Activity, Training, DailySummary
from .serializers import IngredientSerializer, MealSerializer, ActivitySerializer, TrainingSerializer, DailySummarySerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


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
