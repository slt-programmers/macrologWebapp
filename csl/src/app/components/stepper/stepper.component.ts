import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'stepper',
  templateUrl: './stepper.component.html'
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
