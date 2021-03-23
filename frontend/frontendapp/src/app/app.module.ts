import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { LoginComponent } from './account/login/login.component';
import { RegistrationComponent } from './account/registration/registration.component';
import { SettingsComponent } from './account/settings/settings.component';
import { DashboardComponent } from './sections/dashboard/dashboard.component';
import { DietComponent } from './sections/diet/diet.component';
import { TrainingsComponent } from './sections/trainings/trainings.component';
import { FoodbaseComponent } from './sections/foodbase/foodbase.component';
import { ActivitiesComponent } from './sections/activities/activities.component';
import { AboutComponent } from './sections/about/about.component';
import { PagenotfoundComponent } from './navigation/pagenotfound/pagenotfound.component';
import { FooterComponent } from './navigation/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavComponent,
    LoginComponent,
    RegistrationComponent,
    SettingsComponent,
    DashboardComponent,
    DietComponent,
    TrainingsComponent,
    FoodbaseComponent,
    ActivitiesComponent,
    AboutComponent,
    PagenotfoundComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
