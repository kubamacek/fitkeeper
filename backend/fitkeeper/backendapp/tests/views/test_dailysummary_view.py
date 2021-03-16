from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from django.test import TestCase
from fitkeeper.backendapp.models import Training, Activity, MealComponent, Meal, Ingredient, DailySummary, User
from fitkeeper.backendapp.serializers import DailySummarySerializer
from fitkeeper.backendapp.views import DailySummaryViewSet

import datetime
import json


class DailySummaryViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
        self.day = datetime.date(2021, 3, 8)
        banana = Ingredient.objects.create(name="Banana",
                                           energy=89,
                                           fat=0.4,
                                           protein=1.1,
                                           carbohydrate=22.8)
        milk = Ingredient.objects.create(name="Low-Fat Milk 2%",
                                         energy=50,
                                         fat=2,
                                         protein=3.3,
                                         carbohydrate=4.8)
        first_component = MealComponent.objects.create(ingredient=banana,
                                                       weight=100)
        second_component = MealComponent.objects.create(ingredient=milk,
                                                        weight=200)
        meal = Meal.objects.create(name="banana shake",
                                   user=self.user,
                                   day=self.day)
        meal.meal_components.add(first_component, second_component)
        swimming = Activity.objects.create(name="swimming", calories_burned=600)
        cycling = Activity.objects.create(name="cycling", calories_burned=600)
        Training.objects.create(user=self.user, day=self.day, activity=swimming, duration=60)
        Training.objects.create(user=self.user, day=self.day, activity=cycling, duration=120)

    def test_get_all_dailysummaries(self):
        request = self.factory.get('/api/v1/dailysummaries')
        force_authenticate(request, user=self.user)
        response = DailySummaryViewSet.as_view({'get': 'list'})(request)
        meals = DailySummary.objects.all()
        serializer = DailySummarySerializer(meals, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_dailysummary(self):
        ds = DailySummary.objects.first()
        pk = ds.pk
        request = self.factory.get('/api/v1/dailysummaries/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = DailySummaryViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = DailySummarySerializer(ds)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_dailysummary(self):
        pks = [obj.pk for obj in DailySummary.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/dailysummaries/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = DailySummaryViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_not_supported(self):
        data = {}
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/dailysummaries/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_put_not_supported(self):
        ds = DailySummary.objects.first()
        pk = ds.pk
        data = {}
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/dailysummaries/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_not_supported(self):
        ds = DailySummary.objects.first()
        pk = ds.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/dailysummaries/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
