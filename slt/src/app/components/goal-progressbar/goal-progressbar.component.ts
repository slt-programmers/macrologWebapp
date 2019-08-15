import { Component, OnChanges, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';

@Component({
	selector: 'goal-progressbar',
	templateUrl: './goal-progressbar.component.html',
	styleUrls: ['./goal-progressbar.component.scss']
})
export class GoalProgressbarComponent implements OnChanges, AfterViewInit {

	@ViewChild('trackFill', { static: false }) private trackFillElement: ElementRef;

	@Input() percentage: number;
	@Input() title: string;

	public trackFill: HTMLElement;

	constructor() { }

	ngOnChanges() {
		this.onChange();
	}

	ngAfterViewInit() {
		const percentCap = this.percentage > 115 ? 115 : this.percentage;
		const hueDegree = this.calcHue(percentCap);
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = percentCap + '%';
		this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
	}

	onChange() {
		if (this.trackFill) {
			const percentCap = this.percentage > 115 ? 115 : this.percentage;
			const hueDegree = this.calcHue(percentCap);
			this.trackFill = this.trackFillElement.nativeElement;
			this.trackFill.style.width = percentCap + '%';
			this.trackFill.style.filter = 'hue-rotate(' + hueDegree + 'deg)';
		}
	}

	calcHue(percent: number): number {
		// 115%  50   = -120deg;
		// 100%  0    = 0deg;
		// 50%   -50  = 120deg;
		if (percent > 100) {
			const deg = (percent - 100) * -8;
			return deg;
		} else {
			const deg = (percent - 100) * -2.4;
			return deg;
		}
	}
}
