import {Routes} from '@angular/router';

import {LandingPageComponent} from "./pages/landing-page/landing-page.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {HomeComponent} from "./pages/home/home.component";
import {AuthGuard} from "./guards/auth.guard";

export const appRoutes: Routes = [
  {path: '', component: LandingPageComponent, pathMatch: 'full' },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

]



