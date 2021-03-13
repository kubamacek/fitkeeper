from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Ingredient, MealComponent, User
from fitkeeper.backendapp.serializers import MealComponentSerializer, IngredientSerializer
from fitkeeper.backendapp.views import MealComponentViewSet, IngredientViewSet
from decimal import Decimal

import json


class MealComponentViewSetTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
        first_ingredient = Ingredient.objects.create(name="Banana",
                                                     energy=89,
                                                     fat=0.4,
                                                     protein=1.1,
                                                     carbohydrate=22.8)
        second_ingredient = Ingredient.objects.create(name="Low-Fat Milk 2%",
                                                      energy=50,
                                                      fat=2,
                                                      protein=3.3,
                                                      carbohydrate=4.8)
        MealComponent.objects.create(ingredient=first_ingredient, weight=120)
        MealComponent.objects.create(ingredient=second_ingredient, weight=500)

    def test_get_all_mealcomponents(self):
        request = self.factory.get('/api/v1/mealcomponents')
        force_authenticate(request, user=self.user)
        response = MealComponentViewSet.as_view({'get': 'list'})(request)
        mealcomponents = MealComponent.objects.all()
        serializer = MealComponentSerializer(mealcomponents, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_mealcomponent(self):
        first = MealComponent.objects.first()
        pk = first.pk
        request = self.factory.get('/api/v1/mealcomponents/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = MealComponentViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = MealComponentSerializer(first)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_mealcomponent(self):
        pks = [obj.pk for obj in MealComponent.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/mealcomponents/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = MealComponentViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_mealcomponent(self):
        ingredient = Ingredient.objects.get(name="Banana")
        data = json.dumps({
            "ingredient": ingredient.pk,
            "weight": 120
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/mealcomponents/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mealcomponent = MealComponent.objects.get(id=response.data.get('id'))
        self.assertEqual(response.data.get('weight'), mealcomponent.weight)
        self.assertEqual(mealcomponent.ingredient.name, ingredient.name)

    def test_wrong_post_mealcomponent(self):
        data = json.dumps({
            "weight": 120})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/mealcomponents/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_mealcomponent(self):
        mealcomponent = MealComponent.objects.get(ingredient__name="Banana")
        pk = mealcomponent.pk
        data = json.dumps({
            "ingredient": mealcomponent.ingredient.pk,
            "weight": 3000
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/mealcomponents/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mealcomponent = MealComponent.objects.get(pk=pk)
        self.assertEqual(mealcomponent.weight, 3000)

    def test_wrong_put_mealcomponent(self):
        mc = MealComponent.objects.first()
        pk = mc.pk
        data = json.dumps({"weight": 3000})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/mealcomponents/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_mealcomponent(self):
        mc = MealComponent.objects.first()
        pk = mc.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/mealcomponents/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Ingredient.DoesNotExist, Ingredient.objects.get, pk=pk)

    def test_wrong_delete_mealcomponent(self):
        pks = [obj.pk for obj in MealComponent.objects.all()]
        not_existing = max(pks) + 1
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/ingredients/{}/'.format(not_existing))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
