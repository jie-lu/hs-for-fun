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
    this.updateCards();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(ev) {
    ev.preventDefault();
    this._touchStartPt = {
      x: ev.screenX,
      y: ev.screenY
    };
    this.updateCards(true);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(ev) {
    if(this._touchStartPt === null) return;

    let dx = ev.screenX - this._touchStartPt.x;
    this.updateCards(false, null, 360 / (this._calculator.containerSize.width / 2) * dx);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this._touchStartPt = null;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this._touchStartPt = null;
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
