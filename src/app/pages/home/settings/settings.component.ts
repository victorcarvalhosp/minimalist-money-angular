import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../services/categories/categories.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) {
  }

  goToCategories() {
    this.router.navigate(['home/categories']);
  }

  goToAccounts() {
    this.router.navigate(['home/accounts']);
  }

  doSignOut() {
    this.authService.doSignOut();
  }

  ngOnInit() {
  }

}
