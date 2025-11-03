import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, Renderer2, afterRenderEffect, effect, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'ml-stackdonut',
  templateUrl: './stackdonut.component.html',
  styleUrls: ['./stackdonut.component.scss'],
  imports: [DecimalPipe]
})
export class StackDonutComponent {
  private renderer = inject(Renderer2);

  readonly innerCircle = viewChild.required<ElementRef>('innerCircle');
  readonly innerBackgroundCircle = viewChild.required<ElementRef>('innerBackgroundCircle');
  readonly outerCircle = viewChild.required<ElementRef>('outerCircle');

  readonly goal = input.required<number>();
  readonly achieved = input.required<number>();
  readonly text = input.required<string>();
  readonly circleRadius = input(60);
  readonly strokeWidth = input(8);

  public height = (this.circleRadius() + (this.strokeWidth() * 2) + 1) * 2;
  public width = this.height;

  constructor() {
    effect(() => {
      console.log(this.achieved())
      this.drawProgressCircle(this.achieved());
    })

    afterRenderEffect(() => {
      const circleRadius = this.circleRadius();
      const innerCircle = this.innerCircle();
      this.renderer.setAttribute(innerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(circleRadius));
      this.renderer.setAttribute(innerCircle.nativeElement, 'r', '' + circleRadius);

      const innerBackgroundCircle = this.innerBackgroundCircle();
      this.renderer.setAttribute(innerBackgroundCircle.nativeElement, 'stroke-dasharray', '' + (this.getCircleLength(circleRadius)));
      this.renderer.setAttribute(innerBackgroundCircle.nativeElement, 'r', '' + (circleRadius));

      const strokeWidth = this.strokeWidth();
      const outerCircle = this.outerCircle();
      this.renderer.setAttribute(outerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(circleRadius + strokeWidth + 1));
      this.renderer.setAttribute(outerCircle.nativeElement, 'r', (circleRadius + strokeWidth + 1) + '');

      this.drawProgressCircle(0);
    })
  }

  private drawProgressCircle(oldValue: number) {
    console.log('getting inner circle')
    const innerCircle = this.innerCircle();
    console.log(innerCircle)
    const outerCircle = this.outerCircle();
    if (innerCircle && outerCircle) {
      const val = (this.achieved() * 100) / this.goal();
      const radiusInner = innerCircle.nativeElement.getAttribute('r');
      const radiusOuter = outerCircle.nativeElement.getAttribute('r');

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
      this.renderer.setStyle(innerCircle.nativeElement, 'transition-delay', '0s');
      this.renderer.setStyle(outerCircle.nativeElement, 'transition-delay', '0s');
      this.timeAnimations(valOuter, outerCircleWasPresent, pctOuter);
      this.renderer.setStyle(innerCircle.nativeElement, 'strokeDashoffset', pctInner);
    }
  }

  timeAnimations(valOuter: number, outerCircleWasPresent: boolean, pctOuter: number) {
    if (valOuter === 0) {
      // wait until the animation to remove outer circle has finished
      if (outerCircleWasPresent) {
        this.renderer.setStyle(this.innerCircle().nativeElement, 'transition-delay', '0.35s');
      }
      this.renderer.setStyle(this.outerCircle().nativeElement, 'strokeDashoffset', pctOuter);
    } else {
      // wait until the animation to complete inner circle has finished
      const outerCircle = this.outerCircle();
      if (!outerCircleWasPresent) {
        this.renderer.setStyle(outerCircle.nativeElement, 'transition-delay', '0.5s');
      }
      this.renderer.setStyle(outerCircle.nativeElement, 'strokeDashoffset', pctOuter);
    }
  }

  getCircleLength(radius: number) {
    return 2 * radius * Math.PI;
  }
}
