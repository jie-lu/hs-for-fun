import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as calc from './hand-container.calculator';

@Component({
  selector: 'app-hand-container',
  templateUrl: './hand-container.component.html',
  styleUrls: ['./hand-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandContainerComponent implements OnInit, OnDestroy {
  @Input() cards$:Observable<any[]>;

  private cards: any[];
  private _calculator = new calc.HandContainerCalculator();
  private _onDestroy$ = new Subject<void>();

  constructor(private el:ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.initContainerSize();

    this.cards$.pipe(
      takeUntil(this._onDestroy$)
    ).subscribe((items) => {
      this.cards = items;
      setTimeout(() => {
        this.updateCardPosition();
        this.changeDetectorRef.detectChanges();
      }, 0);
    });
  }

  ngOnDestroy() {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }

  @HostListener('window:resize')
  onResize()
  {
    this.initContainerSize();
    this.updateCardPosition();
  }

  private initContainerSize() {
    this._calculator.containerSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
  }

  private updateCardPosition() {
    this.cards.forEach((card, i) => {
      let pos = this._calculator.calculatePosition(i, this.cards.length);
      let trans = this._calculator.calculateTransform(i, this.cards.length);
      card.style = {
        'left.px': pos.x,
        'top.px': pos.y,
        'transform': `rotate(${trans.rotationX}deg)`
      }
    });
  }
}
