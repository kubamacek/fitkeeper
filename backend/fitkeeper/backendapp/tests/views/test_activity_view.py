from rest_framework import status
from rest_framework.test import force_authenticate, APIClient, APITestCase, APIRequestFactory
from fitkeeper.backendapp.models import Activity, User
from fitkeeper.backendapp.serializers import ActivitySerializer
from fitkeeper.backendapp.views import ActivityViewSet

import json


class ActivityViewSetTest(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(
            username='testuser'
        )
        Activity.objects.create(name="swimming", calories_burned=600)
        Activity.objects.create(name="cycling", calories_burned=600)

    def test_get_all_activities(self):
        request = self.factory.get('/api/v1/activities')
        force_authenticate(request, user=self.user)
        response = ActivityViewSet.as_view({'get': 'list'})(request)
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_activity(self):
        swimming = Activity.objects.first()
        pk = swimming.pk
        request = self.factory.get('/api/v1/activities/{}'.format(pk), format='json')
        force_authenticate(request, user=self.user)
        view = ActivityViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=pk)
        serializer = ActivitySerializer(swimming)
        response.render()
        self.assertEqual(json.loads(response.content), serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_not_exisitng_activity(self):
        pks = [obj.pk for obj in Activity.objects.all()]
        not_existing = max(pks) + 1
        request = self.factory.get('/api/v1/activities/{}'.format(not_existing))
        force_authenticate(request, user=self.user)
        view = ActivityViewSet.as_view(actions={'get': 'retrieve'}, detail=True)
        response = view(request, pk=not_existing)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_activity(self):
        data = json.dumps({
            "name": "running",
            "calories_burned": 550})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/activities/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        apple = Activity.objects.filter(name="running").first()
        self.assertEqual(response.data.get('name'), apple.name)

    def test_wrong_post_activity(self):
        data = json.dumps({
            "name": "running"})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/api/v1/activities/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_activity(self):
        swimming = Activity.objects.first()
        pk = swimming.pk
        data = json.dumps({
            "name": "swimming",
            "calories_burned": 700})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/activities/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        swimming = Activity.objects.filter(name="swimming").first()
        self.assertEqual(swimming.calories_burned, 700)

    def test_wrong_put_activity(self):
        swimming = Activity.objects.first()
        pk = swimming.pk
        data = json.dumps({
            "name": "Banana"})
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/api/v1/activities/{}/'.format(pk), data=data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_activity(self):
        swimming = Activity.objects.first()
        pk = swimming.pk
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/activities/{}/'.format(pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(Activity.DoesNotExist, Activity.objects.get, pk=pk)

    def test_wrong_delete_activity(self):
        pks = [obj.pk for obj in Activity.objects.all()]
        not_existing = max(pks) + 1
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete('/api/v1/activities/{}/'.format(not_existing))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
