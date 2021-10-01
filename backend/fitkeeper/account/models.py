from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxValueValidator


class User(AbstractUser):

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        BMR.objects.get_or_create(user=self, defaults={'fat': 100, 'carbohydrate': 100, 'protein': 100})


class BMR(models.Model):
    """
    BMR (Basal Metabolic Rate) object definition.
    Fat, protein and carbohydrate provided in grams.
    """
    fat = models.PositiveIntegerField(validators=[MaxValueValidator(1000)])
    protein = models.PositiveIntegerField(validators=[MaxValueValidator(1000)])
    carbohydrate = models.PositiveIntegerField(validators=[MaxValueValidator(1000)])
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
