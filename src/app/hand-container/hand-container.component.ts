import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FanCalculator } from '../style-calculators/fan-calculator';
import { Point } from '../shared-models/calculation-models';

@Component({
  selector: 'app-hand-container',
  templateUrl: './hand-container.component.html',
  styleUrls: ['./hand-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandContainerComponent implements OnInit, OnDestroy {
  @Input() cards$:Observable<any[]>;

  private cards: any[];
  private _calculator = new FanCalculator();
  private _onDestroy$ = new Subject<void>();
  private _touchStartPt: Point = null;
  private _fanAngle: number = 0;

  constructor(private el:ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  private initContainerSize() {
    this._calculator.containerSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
  }

  ngOnInit() {
    this.initContainerSize();

    this.cards$.pipe(
      takeUntil(this._onDestroy$)
    ).subscribe((items) => this.onCardsChanged(items, true));
  }

  ngOnDestroy() {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  @ContentChild('cardTemplate', {static: false}) cardTemplate : TemplateRef<any>;

  @HostListener('window:resize')
  onResize()
  {
    this.initContainerSize();
    this.updateCards(false, null, this._fanAngle);
  }

  private resetFan() {
    this.updateCards(true);
  }

  private beginFanning(x: number, y: number) {
    this._touchStartPt = {
      x: x,
      y: y
    };
  }

  private performFanning(x: number, y: number) {
    if(this._touchStartPt === null) return;

    let dx = x - this._touchStartPt.x;
    this._fanAngle = 360 / (this._calculator.containerSize.width / 2) * dx
    this.updateCards(false, null, this._fanAngle);
  }

  private stopFanning() {
    this._touchStartPt = null;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent)
  {
    ev.preventDefault();

    if(ev.changedTouches.length !== 1) return;

    this.resetFan();

    let touch = ev.changedTouches[0];
    this.beginFanning(touch.screenX, touch.screenY);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(ev: TouchEvent)
  {
    ev.preventDefault();

    if(ev.changedTouches.length !== 1) return;

    let touch = ev.changedTouches[0];
    this.performFanning(touch.screenX, touch.screenY);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(ev: TouchEvent)
  {
    ev.preventDefault();

    this.stopFanning();
  }

  @HostListener('touchcancel', ['$event'])
  onTouchCancel(ev: TouchEvent)
  {
    ev.preventDefault();

    this.stopFanning();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(ev) {
    ev.preventDefault();

    this.resetFan();
    this.beginFanning(ev.screenX, ev.screenY);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(ev) {
    this.performFanning(ev.screenX, ev.screenY);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.stopFanning();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.stopFanning();
  }

  private onCardsChanged(items: any[], initOnly: boolean = false) {
    this.updateCards(initOnly, items);
  }

  private updateCards(initOnly: boolean = false, items: any[] = null, angle: number = 360) {
    if(items === null) {
      items = this.cards;
    }

    items.forEach((item, i) => {
      item.style = this._calculator.calculateStyle(i, items.length, angle, initOnly);
    });

    this.cards = items;
  }
}
