from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, BMR
from .serializers import UserSerializer, BMRSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )


class BMRViewSet(viewsets.ModelViewSet):
    queryset = BMR.objects.all()
    serializer_class = BMRSerializer
    http_method_names = ['get', 'put']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']
