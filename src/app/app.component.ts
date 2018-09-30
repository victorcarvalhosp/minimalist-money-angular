import {Component} from '@angular/core';
import {UpdateSwService} from "./services/update-sw.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private updateSw: UpdateSwService) {
    console.log('APP COMPONENT');
  }
}
