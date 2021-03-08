from django.test import TestCase
from fitkeeper.backendapp.models import Training, Activity, Meal, Ingredient, DailySummary, User

import datetime


class DailySummaryTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="John")
        self.day = datetime.datetime(2021, 3, 8, 9, 0, 0)
        self.meal_name = "Banana shake"
        self.first_activity = Activity.objects.create(name="swimming",
                                                      calories_burned=600,
                                                      duration=90)
        self.second_activity = Activity.objects.create(name="cycling",
                                                       calories_burned=600,
                                                       duration=120)
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
        self.training = Training.objects.create(day=self.day, user=self.user)
        self.training.activities.add(self.first_activity, self.second_activity)
        self.meal = Meal.objects.create(name=self.meal_name, day=self.day, user=self.user)
        self.meal.ingredients.add(self.first_ingredient, self.second_ingredient)

    def test_dailysummary(self):
        daily_summary = DailySummary.objects.create(day=self.day, user=self.user)
        daily_summary.meals.add(self.meal)
        daily_summary.trainings.add(self.training)
        self.assertEqual(daily_summary.user, self.user)
        self.assertEqual(daily_summary.day, self.day)
        self.assertEqual(daily_summary.meals.first(), self.meal)
        self.assertEqual(daily_summary.trainings.first(), self.training)
