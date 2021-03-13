from django.test import TestCase
from fitkeeper.backendapp.models import Ingredient, MealComponent, Meal, User

import datetime


class MealTestCase(TestCase):
    def setUp(self):
        self.first_ingredient = Ingredient.objects.create(name="Banana",
                                                          energy=89,
                                                          fat=0.4,
                                                          protein=1.1,
                                                          carbohydrate=22.8)
        self.second_ingredient = Ingredient.objects.create(name="Low-Fat Milk 2%",
                                                           energy=50,
                                                           fat=2,
                                                           protein=3.3,
                                                           carbohydrate=4.8)
        self.first_component = MealComponent.objects.create(ingredient=self.first_ingredient,
                                                            weight=100)
        self.second_component = MealComponent.objects.create(ingredient=self.second_ingredient,
                                                             weight=200)
        self.day = datetime.datetime(2021, 3, 8, 9, 0, 0)
        self.user = User.objects.create(username="John")
        self.name = "Banana shake"

    def test_meal(self):
        meal = Meal.objects.create(name=self.name, day=self.day, user=self.user)
        meal.meal_components.add(self.first_component, self.second_component)
        self.assertEqual(meal.name, self.name)
        self.assertEqual(meal.day, self.day)
        self.assertEqual(meal.user, self.user)
        self.assertEqual(list(meal.meal_components.all()), [self.first_component, self.second_component])
