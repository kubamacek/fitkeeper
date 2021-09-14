from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxValueValidator


class User(AbstractUser):

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        bmr = BMR.objects.get_or_create(fat=100, carbohydrate=100, protein=100, user=self)


class BMR(models.Model):
    """
    BMR (Basal Metabolic Rate) object definition.
    Fat, protein and carbohydrate provided in grams.
    """
    fat = models.PositiveIntegerField(validators=[MaxValueValidator(100)])
    protein = models.PositiveIntegerField(validators=[MaxValueValidator(100)])
    carbohydrate = models.PositiveIntegerField(validators=[MaxValueValidator(100)])
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
