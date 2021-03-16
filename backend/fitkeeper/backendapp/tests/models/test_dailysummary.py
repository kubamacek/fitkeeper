from django.test import TestCase
from fitkeeper.backendapp.models import Training, Activity, MealComponent, Meal, Ingredient, DailySummary, User

import datetime


class DailySummaryTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="John")
        self.day = datetime.date(2021, 3, 8)
        self.meal_name = "Banana shake"
        self.activity = Activity.objects.create(name="swimming",
                                                      calories_burned=600)
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
        self.training = Training.objects.create(day=self.day,
                                                user=self.user,
                                                duration=90,
                                                activity=self.activity)
        self.meal = Meal.objects.create(name=self.meal_name, day=self.day, user=self.user)
        self.meal.meal_components.add(self.first_component, self.second_component)

    def test_dailysummary(self):
        daily_summary = DailySummary.objects.get(day=self.day, user=self.user)
        self.assertEqual(daily_summary.user, self.user)
        self.assertEqual(daily_summary.day, self.day)
        self.assertEqual(daily_summary.meals.first(), self.meal)
        self.assertEqual(daily_summary.trainings.first(), self.training)
