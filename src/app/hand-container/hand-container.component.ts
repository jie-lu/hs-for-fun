import { Component, Input, OnInit, OnDestroy, ElementRef, HostListener, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as calc from './hand-container.calculator';
import { FanCalculator } from '../style-calculators/fan-calculator';

@Component({
  selector: 'app-hand-container',
  templateUrl: './hand-container.component.html',
  styleUrls: ['./hand-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandContainerComponent implements OnInit, OnDestroy {
  @Input() cards$:Observable<any[]>;

  private cards: any[];
  //private _calculator = new calc.HandContainerCalculator();
  private _calculator = new FanCalculator();
  private _onDestroy$ = new Subject<void>();

  constructor(private el:ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.initContainerSize();

    this.cards$.pipe(
      takeUntil(this._onDestroy$)
    ).subscribe((items) => this.onCardsChanged(items));
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

  private onCardsChanged(items: any[]) {
    this.cards = items;
    setTimeout(() => {
      this.updateCards();
      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  private initContainerSize() {
    this._calculator.containerSize = {
      width: this.el.nativeElement.clientWidth,
      height: this.el.nativeElement.clientHeight
    };
  }

  private updateCards() {
    this.cards.forEach((card, i) => {
      let style = this._calculator.calculateTransform(i, this.cards.length);

      card.style = style;
    });
  }
}
