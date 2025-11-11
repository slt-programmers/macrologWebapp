import { Component, OnInit, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ml-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.css'],
    imports: [NgClass]
})
export class StepperComponent implements OnInit {

	readonly currentStep = input.required<number>();
	readonly numberOfSteps = input.required<number>();

	public steps: number[] = [];

	ngOnInit() {
		this.steps = new Array<number>();
		for (let i = 1; i <= this.numberOfSteps(); i++) {
			this.steps.push(i);
		}
	}
}
