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

  onCardBackChanged(ev) {
    if(ev.target.files.length == 0) return;

    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.cardBack = fileReader.result;
    };
    fileReader.readAsDataURL(ev.target.files[0]);
  }
}
