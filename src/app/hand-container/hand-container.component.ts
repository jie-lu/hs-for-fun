import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FanCalculator } from '../style-calculators/fan-calculator';
import { Point } from '../shared-models/calculation-models';

enum MovingDirection {
  None = 0,
  Left,
  Right
}

interface DirectionChange {
  direction: MovingDirection,
  angle: number
}

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
  private _fanAngle = 0;
  private _lastFanAngle = 0;
  private _directionChanges: DirectionChange[] = [];
  private _containerCenter: Point;
  private _lastTapTime: number;

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

  private distance(pt1: Point, pt2: Point) {
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
  }

  private angle(vertex: Point, pt2: Point, pt3: Point) {
    let d12 = this.distance(vertex, pt2);
    let d13 = this.distance(vertex, pt3);
    let d23 = this.distance(pt2, pt3);
    return Math.acos((d12 * d12 + d13 * d13 - d23 * d23) / (2 * d12 * d13)) / Math.PI * 180;
  }

  private sideOfPointToLine(a: Point, b: Point, pt: Point) : MovingDirection{
    let r = ((b.x - a.x)*(pt.y - a.y) - (b.y - a.y) * (pt.x - a.x));
    if(r === 0) return MovingDirection.None;
    else if(r < 0) return MovingDirection.Left;
    else return MovingDirection.Right;
  }

  private trackDirectionChange(currentChange: DirectionChange) {
    if(this._directionChanges.length === 0) {
      this._directionChanges.push(currentChange);
    } else {
      let lastChange = this._directionChanges[this._directionChanges.length - 1];

      // Direction changed
      if(currentChange.direction !== lastChange.direction) {
        if(currentChange.angle === lastChange.angle) {
          if(this._directionChanges.length === 1) {
            this._directionChanges[0] = currentChange;
          } else {
            this._directionChanges.pop();
          }
        } else {
          this._directionChanges.push(currentChange);
        }
      }
    }

    return this._directionChanges[this._directionChanges.length - 1];
  }

  private adjustAngle(angle: number): number {
    let currentChange = this._directionChanges[this._directionChanges.length - 1];
    let rounds = Math.floor((this._directionChanges.length - 1) / 2);
    if(this._directionChanges.length % 2 === 1) {
      angle = angle + 360 * rounds;
      if(currentChange.direction === MovingDirection.Left) {
        angle = - angle;
      }
    }
    else {
      if(currentChange.direction === MovingDirection.Left) {
        angle = (360 - angle) + 360 * rounds;
      } else {
        angle = - (360 - angle) - 360 * rounds;
      }
    }

    return angle + this._lastFanAngle;
  }

  private resetFan() {
    this._lastTapTime = undefined;
    this._lastFanAngle = 0;
    this._fanAngle = 0;
    this.updateCards(true, null, 0, 1);
  }

  private beginFanning(pt: Point) {
    this._touchStartPt = pt;
  }

  private performFanning(pt: Point) {
    if(this._touchStartPt === null) return;

    let angle = this.angle(this._containerCenter, this._touchStartPt, pt);
    let currectDirection = this.sideOfPointToLine(this._containerCenter, this._touchStartPt, pt);
    let currentChange = {
      direction: currectDirection,
      angle: Math.abs(angle % 360) < 90 ? 0 : 180
    }

    this.trackDirectionChange(currentChange);
    this._fanAngle = this.adjustAngle(angle);
    this.updateCards(false, null, this._fanAngle);
  }

  private stopFanning() {
    this._touchStartPt = null;
    this._directionChanges = [];
    this._lastFanAngle = this._fanAngle;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent)
  {
    if(ev.touches.length !== 1) return;

    ev.preventDefault();
  
    let lastTapTime = this._lastTapTime;
    this._lastTapTime = Date.now();
    if(lastTapTime){
      let timeDiff = this._lastTapTime - lastTapTime;
      if(timeDiff < 600) {
        this.stopFanning();
        this.resetFan();
        return;
      }
    }

    let touch = ev.touches[0];
    this.beginFanning({x: touch.clientX, y: touch.clientY});
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(ev: TouchEvent)
  {
    if(ev.touches.length !== 1) return;

    ev.preventDefault();

    let touch = ev.touches[0];
    this.performFanning({x: touch.clientX, y: touch.clientY});
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(ev: TouchEvent)
  {
    this.stopFanning();
  }

  @HostListener('touchcancel', ['$event'])
  onTouchCancel(ev: TouchEvent)
  {
    this.stopFanning();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(ev) {
    ev.preventDefault(); // Prevent dragging image
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

  private updateCards(initOnly: boolean = false, items: any[] = null, angle: number = 360, animationDuration = 0) {
    if(items === null) {
      items = this.cards;
    }

    items.forEach((item, i) => {
      item.style = this._calculator.calculateStyle(i, items.length, angle, initOnly, animationDuration);
    });

    this.cards = items;
  }
}
