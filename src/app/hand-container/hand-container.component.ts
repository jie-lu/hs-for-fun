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
  private _sideOfPointToLine: number = 0;
  private _containerCenter: Point;

  constructor(private el:ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  private initContainerSize() {
    let containerRect = this.el.nativeElement.getBoundingClientRect();
    this._calculator.containerSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
    this._containerCenter = {
      x: this.el.nativeElement.clientWidth / 2,
      y: this.el.nativeElement.clientHeight / 2
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

  private beginFanning(pt: Point) {
    this._touchStartPt = pt;
  }

  private distance(pt1: Point, pt2: Point) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
  }

  private angle(vertex: Point, pt2: Point, pt3: Point) {
    let d12 = this.distance(vertex, pt2);
    let d13 = this.distance(vertex, pt3);
    let d23 = this.distance(pt2, pt3);
    return Math.acos((d12 * d12 + d13 * d13 - d23 * d23) / (2 * d12 * d13)) / Math.PI * 180;
  }

  private sideOfPointToLine(a: Point, b: Point, pt: Point){
    return ((b.x - a.x)*(pt.y - a.y) - (b.y - a.y) * (pt.x - a.x));
  }

  private performFanning(pt: Point) {
    if(this._touchStartPt === null) return;

    //let dx = x - this._touchStartPt.x;
    //this._fanAngle = 360 / (this._calculator.containerSize.width / 2) * dx
    let angle = this.angle(this._containerCenter, this._touchStartPt, pt);
    let pointSide = this.sideOfPointToLine(this._touchStartPt, this._containerCenter, pt);
    if(this._sideOfPointToLine === 0) {
      this._sideOfPointToLine = pointSide;
    } 
    
    if(this._sideOfPointToLine > 0) {
      angle = -angle;
    }
    
    if(pointSide * this._sideOfPointToLine < 0) {
      if(this._sideOfPointToLine > 0) {
        angle = - (360 + angle);
      } else {
        angle = (360 - angle);
      }
    }
    this._fanAngle = angle;
    this.updateCards(false, null, this._fanAngle);

    
  }

  private stopFanning() {
    this._touchStartPt = null;
    this._sideOfPointToLine = 0;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent)
  {
    ev.preventDefault();

    if(ev.changedTouches.length !== 1) return;

    this.resetFan();

    let touch = ev.changedTouches[0];
    this.beginFanning({x: touch.clientX, y: touch.clientY});
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(ev: TouchEvent)
  {
    ev.preventDefault();

    if(ev.changedTouches.length !== 1) return;

    let touch = ev.changedTouches[0];
    this.performFanning({x: touch.clientX, y: touch.clientY});
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
    this.beginFanning({ x: ev.clientX, y: ev.clientY });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(ev) {
    this.performFanning({ x: ev.clientX, y: ev.clientY });
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
