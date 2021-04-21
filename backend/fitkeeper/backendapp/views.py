from rest_framework import viewsets, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ingredient, MealComponent, Meal, Activity, Training, DailySummary
from .serializers import (IngredientSerializer, MealSerializer, MealComponentSerializer,
                          ActivitySerializer, TrainingSerializer, DailySummarySerializer)


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    http_method_names = ['get', 'post', 'put', 'delete']


class MealComponentViewSet(viewsets.ModelViewSet):
    queryset = MealComponent.objects.all()
    serializer_class = MealComponentSerializer
    http_method_names = ['get', 'post', 'put', 'delete']


class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'day']


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    http_method_names = ['get', 'post', 'put', 'delete']


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'day']

    def destroy(self, request, *args, **kwargs):
        training = self.get_object()
        self.perform_destroy(training)
        return Response(status=status.HTTP_204_NO_CONTENT, data='Object deleted successfully.')


class DailySummaryViewSet(viewsets.ModelViewSet):
    queryset = DailySummary.objects.all()
    serializer_class = DailySummarySerializer
    http_method_names = ['get']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'day']
