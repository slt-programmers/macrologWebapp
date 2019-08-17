import { Component, OnInit, OnChanges, Renderer2, Input, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';

@Component({
  templateUrl: './stackdonut.component.html',
  selector: 'stackdonut',
  styleUrls: ['./stackdonut.component.scss']
})
export class StackDonutComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('innerCircle', { static: false }) innerCircle: ElementRef;
  @ViewChild('innerBackgroundCircle', { static: false }) innerBackgroundCircle: ElementRef;
  @ViewChild('outerCircle', { static: false }) outerCircle: ElementRef;

  @Input() goal: number;
  @Input() achieved: number;
  @Input() text: string;

  @Input() circleRadius = 60;
  @Input() strokeWidth = 8;

  public height: number;
  public width: number;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.height = (this.circleRadius + (this.strokeWidth * 2) + 1) * 2;
    this.width = this.height;
  }

  ngAfterViewInit() {
    this.renderer.setAttribute(this.innerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(this.circleRadius));
    this.renderer.setAttribute(this.innerCircle.nativeElement, 'r', '' + this.circleRadius);

    this.renderer.setAttribute(this.innerBackgroundCircle.nativeElement, 'stroke-dasharray', '' + (this.getCircleLength(this.circleRadius)));
    this.renderer.setAttribute(this.innerBackgroundCircle.nativeElement, 'r', '' + (this.circleRadius));

    this.renderer.setAttribute(this.outerCircle.nativeElement, 'stroke-dasharray', '' + this.getCircleLength(this.circleRadius + this.strokeWidth + 1));
    this.renderer.setAttribute(this.outerCircle.nativeElement, 'r', (this.circleRadius + this.strokeWidth + 1) + '');

    this.drawProgressCircle(0, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.drawProgressCircle(changes.achieved.previousValue, changes.achieved.currentValue);
  }

  private drawProgressCircle(oldValue: number, newValue: number) {
    if (this.innerCircle && this.outerCircle) {
      const val = (this.achieved * 100) / this.goal;
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

      const outerCircleWasPresent = oldValue !== undefined && oldValue > this.goal;

      // reset both delays
      this.renderer.setStyle(this.innerCircle.nativeElement, 'transition-delay', '0s');
      this.renderer.setStyle(this.outerCircle.nativeElement, 'transition-delay', '0s');

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

      this.renderer.setStyle(this.innerCircle.nativeElement, 'strokeDashoffset', pctInner);
    }
  }

  getCircleLength(radius: number) {
    return 2 * radius * Math.PI;
  }
}
