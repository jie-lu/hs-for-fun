import { Component, OnInit, Input } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';

@Component({
  selector: 'app-text-output',
  templateUrl: './text-output.component.html',
  styleUrls: ['./text-output.component.less']
})
export class TextOutputComponent implements OnInit {

  constructor(public sharedDataService: SharedDataService) { }

  ngOnInit() {
  }

}
