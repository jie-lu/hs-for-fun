import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-card-fan',
  templateUrl: './card-fan.component.html',
  styleUrls: ['./card-fan.component.css']
})
export class CardFanComponent implements OnInit {
  defaultCardBack: SafeUrl;

  constructor(public sharedDataService: SharedDataService,
    private activatedRoute: ActivatedRoute,
    private domSantitizer: DomSanitizer) { 
  }

  ngOnInit() {
    let data = this.activatedRoute.snapshot.data['defaultCardBack'];
    let array = new Uint8Array(data);
    const str = String.fromCharCode.apply(null, array);
    let base64Str = btoa(str);
    this.defaultCardBack = this.domSantitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,${base64Str}`);
  }

}
