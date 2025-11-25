import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
	faCheck,
	faChevronLeft,
	faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { Mealplan } from "src/app/shared/model/mealplan";
import { PlanStore } from "src/app/shared/store/plan.store";
import { PlanMealtime } from "../plan-mealtime/plan-mealtime";
import { Mealtime } from "src/app/shared/model/mealtime";
import { Weekday } from "src/app/shared/model/weekday";
import { Meal } from "src/app/shared/model/meal";

@Component({
	selector: "ml-plan",
	imports: [PlanMealtime, FontAwesomeModule, RouterLink, FormsModule],
	templateUrl: "./plan.html",
	styles: `
  :host {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }`,
})
export class Plan {
	faChevronLeft = faChevronLeft;
	faPencil = faPencil;
	faCheck = faCheck;

	Weekday = Weekday;
	Meal = Meal;

	private readonly planStore = inject(PlanStore);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	plan: Mealplan;

	constructor() {
		const planId = +this.route.snapshot.params["planId"];
		const plan = this.planStore.getPlan(planId);
		if (!plan) {
			this.router.navigate(["dashboard", "plans"]);
		}
		this.plan = plan;
	}

	editTitle = signal(false);

	getMealtime(weekday: Weekday, meal: Meal): Mealtime {
		return (
			this.plan.mealtimes.filter(
				(m) => m.weekday === weekday && m.meal === meal
			)[0] ?? { weekday, meal, items: [] }
		);
	}
}
