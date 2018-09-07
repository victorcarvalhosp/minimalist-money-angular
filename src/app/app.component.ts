import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs/index";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'minimalist-money';
  items: Observable<any[]>;
  constructor(db: AngularFirestore){
    this.items = db.collection('items').valueChanges();
  }
}
