from django.contrib import admin
from .models import Ingredient, Meal, Activity, Training, DailySummary

admin.site.register(Ingredient)
admin.site.register(Meal)
admin.site.register(Activity)
admin.site.register(Training)
admin.site.register(DailySummary)
