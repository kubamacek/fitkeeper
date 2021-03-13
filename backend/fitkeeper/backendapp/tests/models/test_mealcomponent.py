from django.test import TestCase
from fitkeeper.backendapp.models import Ingredient, MealComponent


class MealComponentTestCase(TestCase):
    def setUp(self):
        self.ingredient = Ingredient.objects.create(name="Banana",
                                                    energy=89,
                                                    fat=0.4,
                                                    protein=1.1,
                                                    carbohydrate=22.8)
        self.weight = 120

    def test_meal_component(self):
        meal_component = MealComponent.objects.create(ingredient=self.ingredient, weight=self.weight)
        self.assertEqual(meal_component.ingredient, self.ingredient)
        self.assertEqual(meal_component.weight, self.weight)
