from django.db import models
from fitkeeper.account.models import User


class Ingredient(models.Model):
    """
    Food object definition.
    Values for energy, fat, proteins and carbohydrates are represented for 100g portion.
    Energy is represented in kcal.
    Fat, proteins and carbohydrates are represented in grams.
    """
    decimal_precision = 2
    name = models.CharField(max_length=50)
    energy = models.PositiveIntegerField()
    fat = models.DecimalField(max_digits=5, decimal_places=decimal_precision)
    protein = models.DecimalField(max_digits=5, decimal_places=decimal_precision)
    carbohydrate = models.DecimalField(max_digits=5, decimal_places=decimal_precision)

    def __str__(self):
        return self.name


class MealComponent(models.Model):
    """
    Meal component object defintion.
    Consists of ingredient and quantity in grams.
    """
    weight = models.PositiveIntegerField()
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    def __str__(self):
        return self.ingredient.name + ' ' + str(self.weight) + 'g'


class Meal(models.Model):
    """
    Meal object definition. Meal consists of few ingredients.
    """
    name = models.CharField(max_length=50)
    meal_components = models.ManyToManyField(MealComponent)
    day = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            pass
        super(Meal, self).save(*args, **kwargs)
        dailysummary = DailySummary.objects.get_or_create(day=self.day, user=self.user)[0]
        dailysummary.meals.add(self)


class Activity(models.Model):
    """
    Activity object definition.
    Value for average burned calories is estimated for 1m of activity.
    """
    name = models.CharField(max_length=60)
    calories_burned = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Training(models.Model):
    """
    Training object definition.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if not self.pk:
            pass
        super(Training, self).save(*args, **kwargs)
        dailysummary = DailySummary.objects.get_or_create(day=self.day, user=self.user)[0]
        dailysummary.trainings.add(self)


class DailySummary(models.Model):
    """
    Daily summary object definition.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    meals = models.ManyToManyField(Meal)
    trainings = models.ManyToManyField(Training)
