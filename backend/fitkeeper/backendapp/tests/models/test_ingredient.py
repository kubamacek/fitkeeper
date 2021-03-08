from django.test import TestCase
from fitkeeper.backendapp.models import Ingredient


class IngredientTestCase(TestCase):
    def setUp(self):
        self.name = 'Banana'
        self.energy = 89
        self.fat = 0.4
        self.protein = 1.1
        self.carbohydrate = 22.8

    def test_ingredient(self):
        banana = Ingredient.objects.create(name=self.name,
                                           energy=self.energy,
                                           fat=self.fat,
                                           protein=self.protein,
                                           carbohydrate=self.carbohydrate)
        self.assertEqual(banana.name, self.name)
        self.assertEqual(banana.energy, self.energy)
        self.assertEqual(banana.fat, self.fat)
        self.assertEqual(banana.protein, self.protein)
        self.assertEqual(banana.carbohydrate, self.carbohydrate)
