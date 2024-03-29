from django.test import TestCase
from fitkeeper.backendapp.models import Activity


class ActivityTestCase(TestCase):
    def setUp(self):
        self.name = 'Tennis'
        self.calories_burned = 570

    def test_activity(self):
        activity = Activity.objects.create(name=self.name,
                                           calories_burned=self.calories_burned)
        self.assertEqual(activity.name, self.name)
        self.assertEqual(activity.calories_burned, self.calories_burned)
