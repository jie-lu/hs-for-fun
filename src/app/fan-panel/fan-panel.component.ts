import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'fan-panel',
  templateUrl: './fan-panel.component.html',
  styleUrls: ['./fan-panel.component.less']
})
export class FanPanelComponent implements OnInit {
  defaultCardBack: any;
  cardBack: any;

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
    this.cardBack = this.defaultCardBack;
    this.sharedDataService.drawCard(54);
  }

  onCardBackChanged(imageSrc) {
    this.cardBack = imageSrc;
  }
}