import { Component } from '@angular/core';
import { SharedDataService } from './shared-data/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(public sharedDataService: SharedDataService) { 
  }
}
