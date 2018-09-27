import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../../services/categories/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(public categoriesService: CategoriesService) { }

  ngOnInit() {
  }

}
