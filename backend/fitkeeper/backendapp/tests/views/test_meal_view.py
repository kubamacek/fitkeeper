from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Ingredient, MealComponent, Meal, User
from fitkeeper.backendapp.serializers import MealSerializer
from fitkeeper.backendapp.views import MealViewSet
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

    def test_wrong_post_meal(self):
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10"})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/meals/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_meal_empty_components(self):
        meal = Meal.objects.first()
        pk = meal.pk
        data = json.dumps({
            "name": meal.name,
            "day": "2020-03-10",
            "user": meal.user.pk,
            "meal_components": []})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/meals/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        meal = Meal.objects.get(id=pk)
        self.assertEqual(meal.meal_components.count(), 0)

    def test_put_meal_update_component(self):
        meal = Meal.objects.first()
        pk = meal.pk
        ingredient = meal.meal_components.first().ingredient
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10",
            "name": "single banana",
            "meal_components": [{
                "weight": 300,
                "ingredient": ingredient.pk
            }]
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/meals/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        meal = Meal.objects.get(id=pk)
        self.assertEqual(meal.meal_components.get(ingredient__id=ingredient.pk).weight, 300)

    def test_put_meal_add_component(self):
        cottage_cheese = Ingredient.objects.create(name="Cottage cheese",
                                                   energy=200,
                                                   fat=10.0,
                                                   carbohydrate=12.0,
                                                   protein=14.1)
        meal = Meal.objects.first()
        ingredient = meal.meal_components.first().ingredient
        pk = meal.pk
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10",
            "name": "single banana",
            "meal_components": [{
                "weight": 120,
                "ingredient": ingredient.pk
            }, {
                "weight": 200,
                "ingredient": cottage_cheese.pk
            }]
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/meals/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        meal = Meal.objects.get(id=pk)
        self.assertEqual(meal.meal_components.count(), 2)
        self.assertEqual(meal.meal_components.get(ingredient=cottage_cheese).weight, 200)

    def test_wrong_put_meal(self):
        meal = Meal.objects.first()
        pk = meal.pk
        data = json.dumps({
            "user": self.user.pk,
            "day": "2020-03-10"})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/meals/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_meal(self):
        meal = Meal.objects.first()
        pk = meal.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/meals/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Ingredient.DoesNotExist, Ingredient.objects.get, pk=pk)

    def test_wrong_delete_meal(self):
        pks = [obj.pk for obj in Ingredient.objects.all()]
        not_existing = max(pks) + 1
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/meals/{}/'.format(not_existing))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
