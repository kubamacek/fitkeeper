from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Ingredient, User
from fitkeeper.backendapp.serializers import IngredientSerializer
from fitkeeper.backendapp.views import IngredientViewSet
from decimal import Decimal

import json


class IngredientViewSetTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
        Ingredient.objects.create(name="Banana",
                                  energy=89,
                                  fat=0.4,
                                  protein=1.1,
                                  carbohydrate=22.8)
        Ingredient.objects.create(name="Low-Fat Milk 2%",
                                  energy=50,
                                  fat=2,
                                  protein=3.3,
                                  carbohydrate=4.8)

    def test_get_all_ingredients(self):
        request = self.factory.get('/api/v1/ingredients')
        force_authenticate(request, user=self.user)
        response = IngredientViewSet.as_view({'get': 'list'})(request)
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_ingredient(self):
        banana = Ingredient.objects.first()
        pk = banana.pk
        request = self.factory.get('/api/v1/ingredients/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = IngredientViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = IngredientSerializer(banana)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_ingredient(self):
        pks = [obj.pk for obj in Ingredient.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/ingredients/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = IngredientViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_ingredient(self):
        data = json.dumps({
            "name": "Apple",
            "energy": 52,
            "fat": 0.2,
            "protein": 0.3,
            "carbohydrate": 13.8})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/ingredients/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        apple = Ingredient.objects.filter(name="Apple").first()
        self.assertEqual(response.data.get('name'), apple.name)

    def test_wrong_post_ingredient(self):
        data = json.dumps({
            "name": "Apple",
            "protein": 0.3,
            "carbohydrate": 13.8})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/ingredients/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
