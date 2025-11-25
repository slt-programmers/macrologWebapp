import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Mealplan } from 'src/app/shared/model/mealplan';
import { PlanStore } from 'src/app/shared/store/plan.store';

@Component({
  selector: 'ml-plans',
  imports: [FontAwesomeModule],
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
  faTrash = faTrash;
  private readonly router = inject(Router);
  private readonly planStore = inject(PlanStore);

  plans = this.planStore.plans;

  openPlan(planId: number) {
    this.router.navigate(['dashboard', 'plans', planId]);
  }

  createPlan() {  
    this.planStore.createPlan();
  }
  
  deletePlan(id: number) {
    this.planStore.deletePlan(id);
  }
}
