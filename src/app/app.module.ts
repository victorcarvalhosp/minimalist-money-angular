import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {environment} from '../environments/environment.credentials';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {appRoutes} from './app.routes';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatInputModule, MatProgressBarModule} from '@angular/material';
import {HomeComponent} from './pages/home/home.component';
import {TransactionsComponent} from './pages/home/transactions/transactions.component';
import {DashboardComponent} from './pages/home/dashboard/dashboard.component';
import { SettingsComponent } from './pages/home/settings/settings.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PeriodHeaderComponent } from './components/period-header/period-header.component';
import { Component2Component } from './components/component2/component2.component';
import {DateFnsModule} from 'ngx-date-fns';
import {TransactionCircleColorDirective} from './directives/transaction-circle-color/transaction-circle-color.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    HomeComponent,
    TransactionsComponent,
    DashboardComponent,
    SettingsComponent,
    PeriodHeaderComponent,
    Component2Component,
    TransactionCircleColorDirective
  ],
  imports: [
    AngularFireAuthModule, // import,s firebase/auth, only needed for auth features,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    DateFnsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
