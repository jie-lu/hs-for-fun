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
  cardBacks: string[] = [];
  useMultipleCardBacks: boolean = false;

  constructor(public sharedDataService: SharedDataService,
    private activatedRoute: ActivatedRoute,
    private domSantitizer: DomSanitizer) { 
  }

  getCardBack(index: number) {
    if(this.useMultipleCardBacks && this.cardBacks.length > 0) {
      return this.cardBacks[Math.min(index, this.cardBacks.length)];
    }

    return this.cardBack
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
    this.useMultipleCardBacks = false;
    this.cardBack = imageSrc;
  }

  onCardBackChanged2(imageDataURLs: string[]) {
    this.useMultipleCardBacks = true;
    this.cardBacks = imageDataURLs;
  }
}
