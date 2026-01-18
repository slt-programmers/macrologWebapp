import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ml-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.css'],
    imports: [NgClass]
})
export class StepperComponent {

	readonly currentStep = input.required<number>();
	readonly numberOfSteps = input.required<number>();
	readonly steps = computed(() => {
		const stepArray: number[] = [];
		for (let i = 1; i <= this.numberOfSteps(); i++) {
			stepArray.push(i);
		}
		return stepArray;
	})

}
