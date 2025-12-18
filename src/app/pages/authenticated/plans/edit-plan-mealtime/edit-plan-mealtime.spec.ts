import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditPlanMealtime } from "./edit-plan-mealtime";
import { provideRouter } from "@angular/router";
import { MockComponent, MockProvider } from "ng-mocks";
import { PlanStore } from "src/app/shared/store/plan.store";
import { signal } from "@angular/core";
import { Meal } from "src/app/shared/model/meal";
import { Weekday } from "src/app/shared/model/weekday";
import { AutocompleteFoodComponent } from "src/app/shared/components/autocomplete-food/autocomplete-food.component";

describe("EditPlanMealtime", () => {
	let component: EditPlanMealtime;
	let fixture: ComponentFixture<EditPlanMealtime>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EditPlanMealtime, MockComponent(AutocompleteFoodComponent)],
			providers: [
				MockProvider(PlanStore, {
					mealtimeToEdit: signal({
						meal: Meal.Breakfast,
						weekday: Weekday.Monday,
						ingredients: [],
					}),
				}),
				provideRouter([]),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EditPlanMealtime);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
