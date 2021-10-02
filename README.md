# fitkeeper
Hobby project created to improve full stack web development skills. It allows to control daily activity and caloric balance by planning diet and trainings. Wrapped with tests and example CI/CD approaches for most popular tools.

## stack
* Django with Django REST framework
* Angular 11
* PostgreSQL 12

## overview
* frontend deployed on Netlify - https://fitkeeper-app.netlify.app/
* backend deployed on Heroku - https://fitkeeper-backend.herokuapp.com/
* PostgreSQL database deployed on Heroku with [Heroku Postgres](https://www.heroku.com/postgres)

## continuous integration / continuous delivery practices

Project provides example CI/CD configurations for most popular tools available on the market:
* Jenkins
* TravisCI
* Circle CI
* Gitlab CI/CD

The CI pipeline consists of four stages:
1) static Python code analysis (flake8)
2) backend application tests
3) static TypeScript code analysis (tslint)
4) frontend application tests

The CD pipeline consists of following stages:
1) remote deploy of backend application to Heroku server
2) remote deploy of frontend application to Netlify server

Particular steps were wrapped with Docker/Docker Compose in order to unify environment creation and ensure repeatability and portability.

## further work

* create possibility for users to add new products dynamically (consider https://fdc.nal.usda.gov/ to fetch nutrition data)
* wrap dashboard with some charts about distribution of macronutrients and diet/training history
* add more functionalities - monitor weight and body parts measurements
* database backup process
* add some monitoring for applications and database + visualize that with available open source tools
