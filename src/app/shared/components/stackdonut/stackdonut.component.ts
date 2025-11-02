import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, afterRenderEffect, effect, inject, input } from '@angular/core';

@Component({
  selector: 'ml-stackdonut',
  templateUrl: './stackdonut.component.html',
  styleUrls: ['./stackdonut.component.scss'],
  imports: [DecimalPipe]
})
export class StackDonutComponent implements OnInit {
  private renderer = inject(Renderer2);

  @ViewChild('innerCircle', { static: false }) innerCircle: ElementRef;
  @ViewChild('innerBackgroundCircle', { static: false }) innerBackgroundCircle: ElementRef;
  @ViewChild('outerCircle', { static: false }) outerCircle: ElementRef;

  readonly goal = input<number>();
  readonly achieved = input<number>();
  readonly text = input<string>();
  readonly circleRadius = input(60);
  readonly strokeWidth = input(8);

  public height: number;
  public width: number;

  constructor() {
    effect(() => {
      this.drawProgressCircle(this.achieved());
    })

    afterRenderEffect(() => {
      const circleRadius = this.circleRadius();
      this.renderer.setAttribute(this.innerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(circleRadius));
      this.renderer.setAttribute(this.innerCircle.nativeElement, 'r', '' + circleRadius);

      this.renderer.setAttribute(this.innerBackgroundCircle.nativeElement, 'stroke-dasharray', '' + (this.getCircleLength(circleRadius)));
      this.renderer.setAttribute(this.innerBackgroundCircle.nativeElement, 'r', '' + (circleRadius));

      const strokeWidth = this.strokeWidth();
      this.renderer.setAttribute(this.outerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(circleRadius + strokeWidth + 1));
      this.renderer.setAttribute(this.outerCircle.nativeElement, 'r', (circleRadius + strokeWidth + 1) + '');

      this.drawProgressCircle(0);
    })
  }

  ngOnInit() {
    this.height = (this.circleRadius() + (this.strokeWidth() * 2) + 1) * 2;
    this.width = this.height;
  }

  private drawProgressCircle(oldValue: number) {
    if (this.innerCircle && this.outerCircle) {
      const val = (this.achieved() * 100) / this.goal();
      const radiusInner = this.innerCircle.nativeElement.getAttribute('r');
      const radiusOuter = this.outerCircle.nativeElement.getAttribute('r');

      let valInner = val;
      let valOuter = 0;
      if (val < 0) { valInner = 0; }
      if (val > 100) {
        valInner = 100;
        valOuter = Math.min(val - 100, 100);
      }

      const cInner = Math.PI * (radiusInner * 2);
      const pctInner = ((100 - valInner) / 100) * cInner;

      const cOuter = Math.PI * (radiusOuter * 2);
      const pctOuter = ((100 - valOuter) / 100) * cOuter;

      const outerCircleWasPresent = oldValue !== undefined && oldValue > this.goal();

      // reset both delays
      this.renderer.setStyle(this.innerCircle.nativeElement, 'transition-delay', '0s');
      this.renderer.setStyle(this.outerCircle.nativeElement, 'transition-delay', '0s');
      this.timeAnimations(valOuter, outerCircleWasPresent, pctOuter);
      this.renderer.setStyle(this.innerCircle.nativeElement, 'strokeDashoffset', pctInner);
    }
  }

  timeAnimations(valOuter: number, outerCircleWasPresent: boolean, pctOuter: number) {
    if (valOuter === 0) {
      // wait until the animation to remove outer circle has finished
      if (outerCircleWasPresent) {
        this.renderer.setStyle(this.innerCircle.nativeElement, 'transition-delay', '0.35s');
      }
      this.renderer.setStyle(this.outerCircle.nativeElement, 'strokeDashoffset', pctOuter);
    } else {
      // wait until the animation to complete inner circle has finished
      if (!outerCircleWasPresent) {
        this.renderer.setStyle(this.outerCircle.nativeElement, 'transition-delay', '0.5s');
      }
      this.renderer.setStyle(this.outerCircle.nativeElement, 'strokeDashoffset', pctOuter);
    }
  }

  getCircleLength(radius: number) {
    return 2 * radius * Math.PI;
  }
}
