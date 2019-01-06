import {Routes} from '@angular/router';

import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {TransactionsComponent} from './pages/home/transactions/transactions.component';
import {DashboardComponent} from './pages/home/dashboard/dashboard.component';
import {SettingsComponent} from './pages/home/settings/settings.component';
import {CreateTransactionComponent} from './pages/home/transactions/create-transaction/create-transaction.component';
import {CategoriesComponent} from './pages/home/settings/categories/categories.component';
import {CreateCategoryComponent} from './pages/home/settings/categories/create-category/create-category.component';
import {AccountsComponent} from './pages/home/settings/accounts/accounts.component';
import {CreateAccountComponent} from './pages/home/settings/accounts/create-account/create-account.component';
import {TransactionsFooterDetailsComponent} from './pages/home/transactions/transactions-footer/transactions-footer-details/transactions-footer-details.component';
import {ForgotPasswordComponent} from "./pages/forgot-password/forgot-password.component";
import {ReconciliationComponent} from "./pages/home/reconciliation/reconciliation.component";
import {OfxTransactionsRulesComponent} from "./pages/home/reconciliation/ofx-transactions-rules/ofx-transactions-rules.component";
import {CreateOfxTransactionRuleComponent} from "./pages/home/reconciliation/ofx-transactions-rules/create-ofx-transaction-rule/create-ofx-transaction-rule.component";
import {ImportOfxFileDetailsComponent} from "./pages/home/reconciliation/import-ofx-file-details/import-ofx-file-details.component";
import {SplashComponent} from "./pages/splash/splash.component";

export const appRoutes: Routes = [
  {path: '', component: SplashComponent},
  {path: 'site', component: LandingPageComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      {
        path: 'transactions', component: TransactionsComponent, children: [
          {path: 'new', component: CreateTransactionComponent},
          {path: 'details', component: TransactionsFooterDetailsComponent}
        ]
      },
      {path: 'dashboard', component: DashboardComponent},
      {
        path: 'reconciliation', component: ReconciliationComponent, children: [
          {path: 'importOfx', component: ImportOfxFileDetailsComponent}]
      },
      {
        path: 'ofx-transactions-rules', component: OfxTransactionsRulesComponent, children: [
          {path: 'new', component: CreateOfxTransactionRuleComponent}
        ]
      },
      {path: 'settings', component: SettingsComponent},
      {
        path: 'categories', component: CategoriesComponent, children: [
          {path: 'new', component: CreateCategoryComponent}
        ]
      },
      {
        path: 'accounts', component: AccountsComponent, children: [
          {path: 'new', component: CreateAccountComponent}
        ]
      }
    ]
  },
];



