import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-card-fan',
  templateUrl: './card-fan.component.html',
  styleUrls: ['./card-fan.component.less']
})
export class CardFanComponent implements OnInit {
  defaultCardBack: SafeUrl;

  constructor(public sharedDataService: SharedDataService,
    private activatedRoute: ActivatedRoute,
    private domSantitizer: DomSanitizer) { 
  }

  private convertImageToBase64(data: ArrayBuffer): SafeUrl {
    
    let array = new Uint8Array(data);
    const str = String.fromCharCode.apply(null, array);
    let base64Str = btoa(str);
    return this.domSantitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,${base64Str}`);
  }

  ngOnInit() {
    let data = this.activatedRoute.snapshot.data['defaultCardBack'];
    this.defaultCardBack = this.convertImageToBase64(data);

    this.sharedDataService.drawCard(54);
  }
}
