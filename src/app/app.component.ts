import { Component, OnInit } from '@angular/core';
import { SharedDataService } from './shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(public sharedDataService: SharedDataService,
    private activatedRoute: ActivatedRoute) { 
  }

  ngOnInit() {
    let a = this.activatedRoute.snapshot.data['defaultCardBack'];
  }
}
