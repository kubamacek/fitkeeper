from rest_framework import views, response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer


class UserView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return response.Response(serializer.data)
