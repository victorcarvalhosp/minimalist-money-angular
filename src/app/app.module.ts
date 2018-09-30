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
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule,
  MatNativeDateModule, MatOptionModule,
  MatProgressBarModule, MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {HomeComponent} from './pages/home/home.component';
import {TransactionsComponent} from './pages/home/transactions/transactions.component';
import {DashboardComponent} from './pages/home/dashboard/dashboard.component';
import {SettingsComponent} from './pages/home/settings/settings.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {DateFnsModule} from 'ngx-date-fns';
import {TransactionCircleColorDirective} from './directives/transaction-circle-color/transaction-circle-color.directive';
import {OnlyIntegerPipePipe} from './pipes/only-integer-pipe.pipe';
import {OnlyDecimalPartPipePipe} from './pipes/only-decimal-part-pipe.pipe';
import {CreateTransactionComponent} from './pages/home/transactions/create-transaction/create-transaction.component';
import {HeaderComponent} from './pages/home/components/header/header.component';
import {TransactionTypePipe} from './pipes/transaction-type/transaction-type.pipe';
import {SpeedDialFabComponent} from './components/speed-dial-fab/speed-dial-fab.component';
import {CategoriesComponent} from './pages/home/settings/categories/categories.component';
import { TransactionsHeaderComponent } from './pages/home/transactions/transactions-header/transactions-header.component';
import { CreateCategoryComponent } from './pages/home/settings/categories/create-category/create-category.component';
import {ColorPickerComponent} from './components/color-picker/color-picker.component'
import {CurrencyPipe} from "@angular/common";
import {NgxCurrencyModule} from "ngx-currency";

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
    TransactionsHeaderComponent,
    TransactionCircleColorDirective,
    OnlyIntegerPipePipe,
    OnlyDecimalPartPipePipe,
    CreateTransactionComponent,
    HeaderComponent,
    TransactionTypePipe,
    SpeedDialFabComponent,
    CategoriesComponent,
    CreateCategoryComponent,
    ColorPickerComponent
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
    MatDialogModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
    NgxCurrencyModule,
    DateFnsModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
