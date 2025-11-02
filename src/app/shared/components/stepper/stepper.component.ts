import { Component, OnInit, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ml-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    imports: [NgClass]
})
export class StepperComponent implements OnInit {

	readonly currentStep = input<number>();
	readonly numberOfSteps = input<number>();

	public steps: Array<number>;

	ngOnInit() {
		this.steps = new Array<number>();
		for (let i = 1; i <= this.numberOfSteps(); i++) {
			this.steps.push(i);
		}
	}
}
