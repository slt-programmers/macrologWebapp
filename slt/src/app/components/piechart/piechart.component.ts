import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
	templateUrl: './piechart.component.html',
	selector: 'piechart',
  styleUrls: ['./piechart.component.scss']

})
export class PiechartComponent implements OnInit, AfterViewInit {

	@ViewChild('thisOne' ,  {static: false}) piechartRef: ElementRef;

	@Input() mealId;
	@Input() macros;

	public idstring = 'pie' + this.mealId;

	private protein;
	private fat;
	private carbs;

	private total: number;
	private proteinPercent: number;
	private fatPercent: number;
	private carbsPercent: number;

	public svgEl;
	public cumulativePercent = 0;

	constructor() { }

	ngOnInit() {
		this.protein = this.macros.protein;
		this.fat = this.macros.fat;
		this.carbs = this.macros.carbs;

		this.total = this.protein + this.fat + this.carbs;

		this.proteinPercent = this.protein / this.total;
		this.fatPercent = this.fat / this.total;
		this.carbsPercent = this.carbs / this.total;
	}

	ngAfterViewInit() {
		this.calculatePie();
	}

	public getCoordinatesForPercent(percent) {
		const x = Math.cos(2 * Math.PI * percent);
		const y = Math.sin(2 * Math.PI * percent);
		return [x, y];
	}

	public calculatePie() {
		this.cumulativePercent = 0;
		this.svgEl = this.piechartRef.nativeElement;
		const slices = [
			{ percent: this.proteinPercent, color: '#5bd086' },
			{ percent: this.fatPercent, color: '#f7ed70'},
			{ percent: this.carbsPercent, color: '#fb8353'}
		];

		slices.forEach(slice => {
			// destructuring assignment sets the two variables at once

			const [startX, startY] = this.getCoordinatesForPercent(this.cumulativePercent);

			// each slice starts where the last slice ended, so keep a cumulative percent
			this.cumulativePercent += slice.percent;

			const [endX, endY] = this.getCoordinatesForPercent(this.cumulativePercent);

			// if the slice is more than 50%, take the large arc (the long way around)
			const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

			// create an array and join it just for code readability
			const pathData = [
				`M ${startX} ${startY}`, // Move
				`A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
				`L 0 0`, // Line
			].join(' ');

			// create a <path> and append it to the <svg> element
			const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			pathEl.setAttribute('d', pathData);
			pathEl.setAttribute('fill', slice.color);
      pathEl.setAttribute("width","300px")
			this.svgEl.appendChild(pathEl);
	});
	}

}
