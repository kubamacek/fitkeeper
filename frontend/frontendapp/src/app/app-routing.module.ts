import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './sections/dashboard/dashboard.component';
import { DietComponent } from './sections/diet/diet.component';
import { TrainingsComponent } from './sections/trainings/trainings.component';
import { FoodbaseComponent } from './sections/foodbase/foodbase.component';
import { ActivitiesComponent } from './sections/activities/activities.component';
import { LoginComponent } from 'src/app/account/login/login.component';
import { RegistrationComponent } from 'src/app/account/registration/registration.component';
import { SettingsComponent } from 'src/app/account/settings/settings.component';
import { PagenotfoundComponent } from './navigation/pagenotfound/pagenotfound.component';
import { AboutComponent } from './sections/about/about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'diet', component: DietComponent},
  { path: 'trainings', component: TrainingsComponent},
  { path: 'foodbase', component: FoodbaseComponent},
  { path: 'activities', component: ActivitiesComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegistrationComponent},
  { path: 'about', component: AboutComponent},
  { path: '**', component: PagenotfoundComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
