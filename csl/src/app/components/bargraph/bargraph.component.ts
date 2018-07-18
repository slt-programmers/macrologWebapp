import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'bargraph',
  templateUrl: './bargraph.component.html'
})
export class BargraphComponent implements OnInit {

	@ViewChild('trackFill') private trackFillElement: ElementRef;

	@Input() percentage: number;
  @Input() title: string;

  public trackFill;

  constructor() { }

  ngOnInit() {
		let percentCap = this.percentage > 150 ? 150 : this.percentage;
		let hueDegree = this.calcHue(percentCap);
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = percentCap + '%';
		this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
  }

	onChange() {
		let percentCap = this.percentage > 150 ? 150 : this.percentage;
		let hueDegree = this.calcHue(percentCap);
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = percentCap + '%';
		this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
	}
  ngOnChanges(){
    this.onChange();
  }

	calcHue(percent: number): number {
		// 150%  50   = -120deg;
		// 100%  0    = 0deg;
		// 50%   -50  = 120deg;

		let deg = (percent - 100) * -2.4;
		return deg;
	}
}
