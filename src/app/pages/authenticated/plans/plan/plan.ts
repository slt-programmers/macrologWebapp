import { Component } from '@angular/core';
import { PlanMealtime } from '../plan-mealtime/plan-mealtime';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ml-plan',
  imports: [PlanMealtime, FontAwesomeModule, RouterLink],
  templateUrl: './plan.html',
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }`

})
export class Plan {
  faChevronLeft = faChevronLeft;
}
