import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'ml-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

	@Input() currentStep: number;
	@Input() numberOfSteps: number;

	public steps: Array<number>;

	constructor() { }

	ngOnInit() {
		this.steps = new Array<number>();
		for (let i = 1; i <= this.numberOfSteps; i++) {
			this.steps.push(i);
		}
	}
}
