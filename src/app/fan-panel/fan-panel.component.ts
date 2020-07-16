import { Component, OnInit, ViewChild, ComponentRef, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CardBackMakerComponent } from '../card-back-maker/card-back-maker.component';
import { CardBackSelectorComponent } from '../card-back-selector/card-back-selector.component';
import { FanContainerComponent } from '../fan-container/fan-container.component';

@Component({
  selector: 'fan-panel',
  templateUrl: './fan-panel.component.html',
  styleUrls: ['./fan-panel.component.less']
})
export class FanPanelComponent implements OnInit, AfterViewInit {
  defaultCardBack: any;
  cardBack: any;
  cardBacks: string[] = [];
  useMultipleCardBacks: boolean = false;

  @ViewChild(CardBackSelectorComponent, { static: true})
  cardBackSelector: CardBackSelectorComponent;

  @ViewChild(FanContainerComponent, {static: true})
  fanContainer: FanContainerComponent;

  constructor(public sharedDataService: SharedDataService,
    private activatedRoute: ActivatedRoute,
    private domSantitizer: DomSanitizer,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,) { 
  }

  getCardBack(index: number) {
    if(this.useMultipleCardBacks && this.cardBacks.length > 0) {
      return this.cardBacks[Math.min(index, this.cardBacks.length)] || this.cardBack;
    }

    return this.cardBack
  }

  private convertImageToDataURL(data: ArrayBuffer, fileExtension: string): string {
    
    var base64Str = btoa(
      new Uint8Array(data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/${fileExtension};base64,${base64Str}`;
  }

  private convertImageToSantitizedDataURL(data: ArrayBuffer, fileExtension: string): SafeUrl {
    return this.domSantitizer.bypassSecurityTrustUrl(this.convertImageToDataURL(data, fileExtension));
  }

  ngOnInit() {
    let cardBacks = this.activatedRoute.snapshot.data['defaultCardBacks'];
    this.defaultCardBack = this.convertImageToSantitizedDataURL(cardBacks[0], 'jpg');
    this.cardBack = this.defaultCardBack;
    this.sharedDataService.drawCard(54);
  }

  ngAfterViewInit() {
    let cardBacks = this.activatedRoute.snapshot.data['defaultCardBacks'];
    // Fanning image
    if(cardBacks.length > 1) {
      this.cardBackSelector.setFanningImageDataURL(this.convertImageToDataURL(cardBacks[1], 'png'));
    }
  }

  onCardBackChanged(imageSrc) {
    this.useMultipleCardBacks = false;
    this.cardBack = imageSrc;
  }

  onCardBackChanged2(imageDataURLs: string[]) {
    // setTimeout(() => {
    //   this.useMultipleCardBacks = true;
    //   this.cardBacks = imageDataURLs;
    // }, 0);

    //this.sharedDataService.cardBackText = imageDataURLs.join('\r\n\r\n');
    //this.router.navigate(['text-output']);
  }

  onEveryCardBackChanged(imageItem: { image: string, index: number }) {
    this.useMultipleCardBacks = true;
    if(this.cardBacks.length == 0) {
      this.cardBacks = new Array(54);
    }

    this.cardBacks[imageItem.index] = imageItem.image;
    const angle = 190.0 / 54 * (imageItem.index + 1);
    this.fanContainer.updateCards(false, null, angle);
    if(imageItem.index == 53) {
      this.fanContainer.stopFanning();
    }
  }
}
