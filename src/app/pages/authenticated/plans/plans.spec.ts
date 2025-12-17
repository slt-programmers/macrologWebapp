import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Plans } from "./plans";
import { provideRouter } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { PlanStore } from "src/app/shared/store/plan.store";
import { signal } from "@angular/core";

describe("Plans", () => {
	let component: Plans;
	let fixture: ComponentFixture<Plans>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Plans],
			providers: [
				provideRouter([]),
				MockProvider(PlanStore, { plans: signal([]) }),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(Plans);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
