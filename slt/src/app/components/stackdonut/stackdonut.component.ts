import { Component, OnInit, OnChanges, Renderer2, Input, ViewChild, ElementRef, AfterViewInit,SimpleChanges } from '@angular/core';

@Component({
	templateUrl: './stackdonut.component.html',
	selector: 'stackdonut',
  styleUrls: ['./stackdonut.component.scss']
})
export class StackDonutComponent implements AfterViewInit, OnChanges {

	@ViewChild('innerCircle' ,  {static: false}) innerCircle: ElementRef;
	@ViewChild('outerCircle' ,  {static: false}) outerCircle: ElementRef;

	@Input() goal:number;
	@Input() achieved:number;
  @Input() text;

	constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.drawProgressCircle(0,0);
	}
	ngOnChanges(changes: SimpleChanges) {
    this.drawProgressCircle(changes.achieved.previousValue,changes.achieved.currentValue);
	}

  private drawProgressCircle(oldValue:number, newValue:number){
     if (this.innerCircle && this.outerCircle) {
		  let val = (this.achieved*100) / this.goal;
      let radiusInner = this.innerCircle.nativeElement.getAttribute('r');
      let radiusOuter = this.outerCircle.nativeElement.getAttribute('r');

      let valInner = val;
      let valOuter = 0;
	  	if (val < 0) { valInner = 0;}
			if (val > 100) {
			  valInner = 100;
        valOuter = Math.min(val - 100, 100);
      }

  		const cInner = Math.PI*(radiusInner*2);
			let pctInner = ((100-valInner)/100)*cInner;

  		const cOuter = Math.PI*(radiusOuter*2);
			let pctOuter = ((100-valOuter)/100)*cOuter;

      let outerCircleWasPresent = oldValue !== undefined && oldValue > this.goal;

      // reset both delays
      this.renderer.setStyle(this.innerCircle.nativeElement,'transition-delay','0s');
      this.renderer.setStyle(this.outerCircle.nativeElement,'transition-delay','0s');

      if (valOuter ==0 ){

        // wait until the animation to remove outer circle has finished
        if (outerCircleWasPresent) {
          this.renderer.setStyle(this.innerCircle.nativeElement,'transition-delay','0.35s');
        }
        this.renderer.setStyle(this.outerCircle.nativeElement,'strokeDashoffset', pctOuter);
      } else {

        // wait until the animation to complete inner circle has finished
        if (!outerCircleWasPresent) {
          this.renderer.setStyle(this.outerCircle.nativeElement,'transition-delay','0.5s');
        }
        this.renderer.setStyle(this.outerCircle.nativeElement,'strokeDashoffset',pctOuter);
      }

      this.renderer.setStyle(this.innerCircle.nativeElement,'strokeDashoffset',pctInner);
    }
  }
}
