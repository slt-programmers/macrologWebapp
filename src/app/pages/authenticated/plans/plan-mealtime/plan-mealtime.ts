import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ml-plan-mealtime',
  imports: [],
  templateUrl: './plan-mealtime.html',
})
export class PlanMealtime {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  openPlanMealtime(mealtimeId: number) {
    this.router.navigate(['edit', mealtimeId], {relativeTo: this.route})
  }
}
