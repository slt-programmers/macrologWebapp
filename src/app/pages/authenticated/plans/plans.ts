import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Mealplan } from 'src/app/shared/model/mealplan';
import { PlanStore } from 'src/app/shared/store/plan.store';

@Component({
  selector: 'ml-plans',
  imports: [],
  templateUrl: './plans.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `
})
export class Plans {
  private readonly router = inject(Router);
  private readonly planStore = inject(PlanStore);

  // TODO remove
  plans = this.planStore.plans;

  openPlan(planId: number) {
    this.router.navigate(['dashboard', 'plans', planId]);
  }

  createPlan() {  
    this.planStore.createPlan();
    this.router.navigate(['dashboard', 'plans', 0]);
  }
}
