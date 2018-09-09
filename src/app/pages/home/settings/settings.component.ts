import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../services/categories/categories.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  categories: Observable<any[]>;
  constructor(public categoriesService: CategoriesService, public authService: AuthService) {
    this.categories = this.categoriesService.categories;
  }

  doSignOut() {
    this.authService.doSignOut();
  }

  ngOnInit() {
  }

}
