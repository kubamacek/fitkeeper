from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Activity, Training, User
from fitkeeper.backendapp.serializers import TrainingSerializer
from fitkeeper.backendapp.views import TrainingViewSet

import json
import datetime


class TrainingViewSetTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
        self.user2 = User.objects.create(username='testuser2')
        self.day = datetime.date(2021, 3, 8)
        swimming = Activity.objects.create(name="swimming", calories_burned=600)
        cycling = Activity.objects.create(name="cycling", calories_burned=600)
        Training.objects.create(user=self.user, day=self.day, activity=swimming, duration=60)
        Training.objects.create(user=self.user2, day=self.day, activity=cycling, duration=120)

    def test_get_all_trainings(self):
        request = self.factory.get('/api/v1/trainings')
        force_authenticate(request, user=self.user)
        response = TrainingViewSet.as_view({'get': 'list'})(request)
        trainings = Training.objects.all()
        serializer = TrainingSerializer(trainings, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_training(self):
        swimming = Training.objects.first()
        pk = swimming.pk
        request = self.factory.get('/api/v1/trainings/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = TrainingViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = TrainingSerializer(swimming)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_training(self):
        pks = [obj.pk for obj in Training.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/trainings/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = TrainingViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_training(self):
        tennis = Activity.objects.create(name="tennis", calories_burned=400)
        data = json.dumps({
            "day": "2021-03-08",
            "duration": 75,
            "user": self.user.pk,
            "activity": tennis.pk
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/trainings/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('duration'), 75)
        self.assertEqual(response.data.get('activity'), tennis.name)

    def test_wrong_post_activity(self):
        data = json.dumps({
            "duration": 75})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/trainings/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_activity(self):
        swimming = Activity.objects.get(name="swimming")
        training = Training.objects.get(activity=swimming.pk)
        pk = training.pk
        training.duration = 30
        data = json.dumps({
            "day": "2021-03-08",
            "duration": training.duration,
            "user": training.user.pk,
            "activity": training.activity.pk
        })
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/trainings/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        training = Training.objects.get(activity=swimming.pk)
        self.assertEqual(training.duration, 30)

    def test_wrong_put_activity(self):
        training = Training.objects.first()
        pk = training.pk
        data = json.dumps({
            "duration": training.duration})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/trainings/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_activity(self):
        swimming = Training.objects.first()
        pk = swimming.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/trainings/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Activity.DoesNotExist, Activity.objects.get, pk=pk)

    def test_wrong_delete_activity(self):
        pks = [obj.pk for obj in Activity.objects.all()]
        not_existing = max(pks) + 1
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/trainings/{}/'.format(not_existing))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
