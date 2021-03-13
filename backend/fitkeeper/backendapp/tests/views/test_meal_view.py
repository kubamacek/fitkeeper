from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Ingredient, MealComponent, Meal, User
from fitkeeper.backendapp.serializers import MealSerializer, IngredientSerializer
from fitkeeper.backendapp.views import MealViewSet, IngredientViewSet
from decimal import Decimal
from datetime import date

import json


class MealViewSetTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
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
                                   day=date(2020, 3, 10))
        meal.meal_components.add(first_component, second_component)

    def test_get_all_meals(self):
        request = self.factory.get('/api/v1/meals')
        force_authenticate(request, user=self.user)
        response = MealViewSet.as_view({'get': 'list'})(request)
        meals = Meal.objects.all()
        serializer = MealSerializer(meals, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_meal(self):
        meal = Meal.objects.first()
        pk = meal.pk
        request = self.factory.get('/api/v1/meals/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = MealViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = MealSerializer(meal)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_meal(self):
        pks = [obj.pk for obj in Meal.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/meals/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = MealViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_meal(self):
        banana = Ingredient.objects.get(name="Banana")
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10",
            "name": "single banana",
            "meal_components": [{
                "weight": 120,
                "ingredient": banana.pk
            }]
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/meals/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('name'), "single banana")
        id = response.data.get('id')
        meal = Meal.objects.get(id=id)
        self.assertEqual(meal.meal_components.all()[0].ingredient.name, banana.name)
        self.assertEqual(meal.day, date(2020, 3, 10))
        self.assertEqual(meal.user, self.user)

    def test_wrong_post_ingredient(self):
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10"})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/meals/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
'''
    def test_put_ingredient(self):
        banana = Ingredient.objects.first()
        pk = banana.pk
        data = json.dumps({
            "name": "Banana",
            "energy": 123,
            "fat": 0.5,
            "protein": 17.2,
            "carbohydrate": 10.0})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/ingredients/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        banana = Ingredient.objects.filter(name="Banana").first()
        self.assertEqual(banana.fat, Decimal('0.5'))
        self.assertEqual(banana.carbohydrate, Decimal('10.0'))
        self.assertEqual(banana.energy, 123)
        self.assertEqual(banana.protein, Decimal('17.2'))

    def test_wrong_put_ingredient(self):
        banana = Ingredient.objects.first()
        pk = banana.pk
        data = json.dumps({
            "name": "Banana",
            "energy": 123,
            "protein": 17.2,
            "carbohydrate": 10.0})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/ingredients/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_ingredient(self):
        banana = Ingredient.objects.first()
        pk = banana.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/ingredients/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Ingredient.DoesNotExist, Ingredient.objects.get, pk=pk)

    def test_wrong_delete_ingredient(self):
        pks = [obj.pk for obj in Ingredient.objects.all()]
        not_existing = max(pks) + 1
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/ingredients/{}/'.format(not_existing))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
'''
