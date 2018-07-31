import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
	templateUrl: './piechart.html',
	selector: 'piechart'
})
export class Piechart implements OnInit{

	@ViewChild('thisOne') piechartRef: ElementRef;


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

	constructor() { }

	ngOnInit() {
		this.protein = this.macros.protein;
		this.fat = this.macros.fat;
		this.carbs = this.macros.carbs;

		this.total = this.protein + this.fat + this.carbs;

		this.proteinPercent = this.protein / this.total;
		this.fatPercent = this.fat / this.total;
		this.carbsPercent = this.carbs / this.total;

		this.calculatePie();
	}

	public svgEl;

	public cumulativePercent = 0;

	getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
	}

	calculatePie() {
		console.log(this.proteinPercent);
		console.log(this.fatPercent);
		console.log(this.carbsPercent);
		console.log(this.proteinPercent + this.fatPercent + this.carbsPercent);

		this.cumulativePercent = 0;
		this.svgEl = this.piechartRef.nativeElement;
		let slices = [
			{ percent: this.proteinPercent, color: '#5bd086' },
			{ percent: this.fatPercent, color: '#f7ed70' },
			{ percent: this.carbsPercent, color: '#fb8353' },
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
      this.svgEl.appendChild(pathEl);
		});
	}

}