from django.db import models
from django.contrib.auth.models import User


class Ingredient(models.Model):
    """
    Food object definition.
    Values for energy, fat and portion are represented for 100g portion.
    Fat, proteins and carbohydrates are represented in grams.
    """
    decimal_precision = 2
    name = models.CharField(max_length=50)
    energy = models.PositiveIntegerField()
    fat = models.DecimalField(max_digits=5, decimal_places=decimal_precision)
    protein = models.DecimalField(max_digits=5, decimal_places=decimal_precision)
    carbohydrate = models.DecimalField(max_digits=5, decimal_places=decimal_precision)


class Meal(models.Model):
    """
    Meal object definition. Meal consists of few ingredients.
    """
    name = models.CharField(max_length=50)
    ingredients = models.ManyToManyField(Ingredient)
    day = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Activity(models.Model):
    """
    Activity object definition.
    Value for average burned calories is estimated for 1h of activity.
    Duration represents activity time in minutes.
    """
    name = models.CharField(max_length=30)
    calories_burned = models.PositiveIntegerField()
    duration = models.PositiveIntegerField()


class Training(models.Model):
    """
    Training object definition.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    activities = models.ManyToManyField(Activity)


class DailySummary(models.Model):
    """
    Daily summary object definition.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    meals = models.ManyToManyField(Meal)
    trainings = models.ManyToManyField(Training)
