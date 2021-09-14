from django.test import TestCase
from fitkeeper.account.models import User, BMR


class UserTestCase(TestCase):
    def setUp(self):
        self.email = 'john.doe@test.com'
        self.username = 'john'
        self.password = 'testpassword'
    
    def test_user(self):
        user = User.objects.create(email=self.email,
                                   username=self.username,
                                   password=self.password)
        self.assertEqual(user.email, self.email)
        self.assertEqual(user.password, self.password)

    def test_user_bmr(self):
        user = User.objects.create(email=self.email,
                                   username=self.username,
                                   password=self.password)
        bmr = BMR.objects.get(user=user.pk)
        self.assertEqual(bmr.fat, 100)

