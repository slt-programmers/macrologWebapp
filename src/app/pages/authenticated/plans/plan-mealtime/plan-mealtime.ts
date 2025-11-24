import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dish } from 'src/app/shared/model/dish';
import { Food } from 'src/app/shared/model/food';

@Component({
  selector: 'ml-plan-mealtime',
  imports: [FontAwesomeModule],
  templateUrl: './plan-mealtime.html',
})
export class PlanMealtime {
  faPlus = faPlus;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  items: Array<Food | Dish> = [];

  openPlanMealtime(mealtimeId: number) {
    this.router.navigate(['edit', mealtimeId], { relativeTo: this.route })
  }
}
