from django.test import TestCase
from fitkeeper.backendapp.models import Training, Activity, User

import datetime


class TrainingTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="John")
        self.day = datetime.datetime(2021, 3, 8, 9, 0, 0)
        self.first_activity = Activity.objects.create(name="swimming",
                                                      calories_burned=600,
                                                      duration=90)
        self.second_activity = Activity.objects.create(name="cycling",
                                                       calories_burned=600,
                                                       duration=120)

    def test_training(self):
        training = Training.objects.create(day=self.day, user=self.user)
        training.activities.add(self.first_activity, self.second_activity)
        self.assertEqual(training.day, self.day)
        self.assertEqual(training.user, self.user)
        self.assertEqual(list(training.activities.all()), [self.first_activity, self.second_activity])
