"""fitkeeper URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from knox import views as knox_views
from fitkeeper.backendapp import views
from fitkeeper.account import views as accountviews

router = routers.DefaultRouter()
router.register(r'ingredients', views.IngredientViewSet)
router.register(r'mealcomponents', views.MealComponentViewSet)
router.register(r'meals', views.MealViewSet)
router.register(r'activities', views.ActivityViewSet)
router.register(r'trainings', views.TrainingViewSet)
router.register(r'dailysummaries', views.DailySummaryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/auth/register/', accountviews.RegisterAPI.as_view()),
    path('api/v1/auth/login/', accountviews.LoginAPI.as_view()),
    path('api/v1/auth/logout/', knox_views.LogoutView.as_view()),
    path('api/v1/auth/logoutall/', knox_views.LogoutAllView.as_view()),
]
