from django.test import TestCase
from fitkeeper.backendapp.models import Training, Activity, User

import datetime


class TrainingTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="John")
        self.day = datetime.datetime(2021, 3, 8, 9, 0, 0)
        self.duration = 60
        self.activity = Activity.objects.create(name="swimming",
                                                calories_burned=600)

    def test_training(self):
        training = Training.objects.create(day=self.day,
                                           user=self.user,
                                           activity=self.activity,
                                           duration=self.duration)
        self.assertEqual(training.day, self.day)
        self.assertEqual(training.user, self.user)
        self.assertEqual(training.activity, self.activity)
        self.assertEqual(training.duration, self.duration)
