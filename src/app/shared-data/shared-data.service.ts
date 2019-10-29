import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private _handSource = new Subject<any[]>();
  private _cards = [];

  hand$ = this._handSource.asObservable();

  drawCard() {
    this._cards = [...this._cards, {}];
    this._handSource.next(this._cards);
  }
}
