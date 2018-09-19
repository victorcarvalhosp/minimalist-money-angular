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

  constructor(public categoriesService: CategoriesService, public authService: AuthService) {
  }

  doSignOut() {
    this.authService.doSignOut();
  }

  ngOnInit() {
  }

}
