import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private _handSource = new BehaviorSubject<any[]>([]);
  private _cards = [];

  hand$ = this._handSource.asObservable();

  constructor() {
  }

  drawCard(count: number = 1, clearExisting: boolean = false) {
    let added = new Array(count).fill(undefined).map(() => ({}));
    if(clearExisting) {
      this._cards = added;
    } else {
      this._cards = this._cards.concat(added);
    }

    this._handSource.next(this._cards);
  }

  cardBackText: string;
}
