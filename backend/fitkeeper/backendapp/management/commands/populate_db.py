from fitkeeper.settings import BASE_DIR
from django.core.management.base import BaseCommand
from fitkeeper.backendapp.models import Activity, Ingredient
import pandas as pd
import os


# datasets are taken from kaggle page:
# nutrition: https://www.kaggle.com/niharika41298/nutrition-details-for-most-common-foods
# activitities: https://www.kaggle.com/aadhavvignesh/calories-burned-during-exercise-and-activities


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        print("STARTED adding ingredients to database")
        df = _prepare_nutrition_data_from_file(os.path.join(BASE_DIR, 'fitkeeper', 'data', 'nutrition.csv'))
        for index, row in df.iterrows():
            print("Started inserting {} into database...".format(row['Food']))
            if row['Grams'] != 100:
                energy = _adjust_factor_per_100g(row['Grams'], row['Calories'])
                protein = _adjust_factor_per_100g(row['Grams'], row['Protein'])
                fat = _adjust_factor_per_100g(row['Grams'], row['Fat'])
                carbs = _adjust_factor_per_100g(row['Grams'], row['Carbs'])
            else:
                energy = row['Calories']
                protein = row['Protein']
                fat = row['Fat']
                carbs = row['Carbs']
            Ingredient.objects.create(name=row['Food'],
                                      energy=energy,
                                      fat=fat,
                                      protein=protein,
                                      carbohydrate=carbs)
        print("FINISHED adding ingredients to database")
        print("STARTED adding activities to database")
        df = _prepare_sport_data_from_file(os.path.join(BASE_DIR, 'fitkeeper', 'data', 'activities.csv'))
        for index, row in df.iterrows():
                print("Started inserting {} into databse...".format(row['Activity']))
                name = row['Activity']
                calories_burned = _adjust_factor_per_minute(row['155 lb']) # using 70kg people as average
                Activity.objects.create(name=name, calories_burned=calories_burned)
        print("FINISHED adding activities to database")


def _adjust_factor_per_100g(grams, weight):
    return round(100*int(weight)/int(grams))


def _prepare_nutrition_data_from_file(file):
    df = pd.read_csv(file)
    df = df.replace('t', 0)
    df = df.replace(',', '', regex=True)
    return df


def _prepare_sport_data_from_file(file):
    df = pd.read_csv(file)
    return df


def _adjust_factor_per_minute(calories):
    return round(calories/60)
