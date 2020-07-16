import { Component, OnInit, Output, EventEmitter, ViewChild, ComponentRef } from '@angular/core';
import { CardBackMakerComponent } from '../card-back-maker/card-back-maker.component';

@Component({
  selector: 'card-back-selector',
  templateUrl: './card-back-selector.component.html',
  styleUrls: ['./card-back-selector.component.less']
})
export class CardBackSelectorComponent implements OnInit {

  constructor() { }

  selectedCardBack: any;
  selectedCardBack2: any;
  customCardBack: any;
  cardBacks: any[] = [
    'assets/card-backs/ventus_back.jpg',
    'assets/card-backs/hearthstone/classic.jpg', 
    'assets/card-backs/hearthstone/mark_of_hakkar.png'];
  @Output() cardBackChanged = new EventEmitter();
  @Output() cardBackChanged2 = new EventEmitter<string[]>();
  @Output() everyCardBackChanged = new EventEmitter<{ image: string, index: number }>();

  @ViewChild(CardBackMakerComponent, { static: true})
  cardBackMaker: CardBackMakerComponent;

  ngOnInit() {
  }

  selectCardBack(image) {
    this.selectedCardBack = image;
    this.cardBackChanged.emit(image);
  }

  onEveryCardBackChanged(imageItem: { image: string, index: number }) {
    this.everyCardBackChanged.emit(imageItem);
  }

  onCardBackChanged2(imgDataURLs: string[]) {
    this.selectedCardBack = imgDataURLs;
    this.cardBackChanged2.emit(imgDataURLs);
  }

  selectCustomImage(ev) {
    if(ev.target.files.length == 0) return;

    let fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.customCardBack = fileReader.result;
      this.selectCardBack(this.customCardBack);
    };
    fileReader.readAsDataURL(ev.target.files[0]);
  }

  setFanningImageDataURL(imageDataURL: string) {
    this.cardBackMaker.setImageDataURL(imageDataURL);
  }
}
