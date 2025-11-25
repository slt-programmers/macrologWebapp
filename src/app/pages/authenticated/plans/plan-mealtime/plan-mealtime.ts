import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dish } from 'src/app/shared/model/dish';
import { Food } from 'src/app/shared/model/food';
import { Ingredient } from 'src/app/shared/model/ingredient';
import { Mealtime } from 'src/app/shared/model/mealtime';
import { PlanStore } from 'src/app/shared/store/plan.store';

@Component({
  selector: 'ml-plan-mealtime',
  imports: [FontAwesomeModule],
  templateUrl: './plan-mealtime.html',
})
export class PlanMealtime {
  faPlus = faPlus;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly planStore = inject(PlanStore);

  readonly mealtime = input.required<Mealtime>();

  openPlanMealtime() {
    this.planStore.setMealtimeToEdit(this.mealtime());
    this.router.navigate(['edit'], { relativeTo: this.route })
  }
}
