import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { UserService } from "src/app/shared/services/user.service";

import { signal } from "@angular/core";
import { ActivityStore } from "src/app/shared/store/activity.store";
import { ActivityPageRowComponent } from "./activity-page-row.component";
import { StravaSyncedAccount } from "src/app/shared/model/stravaSynchedAccount";

describe("ActivityPageRowComponent", () => {
	let component: ActivityPageRowComponent;
	let fixture: ComponentFixture<ActivityPageRowComponent>;
	let userService: UserService;
	let activityStore: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, ActivityPageRowComponent],
			providers: [
				MockProvider(UserService),
				MockProvider(ActivityStore, {
					activitiesPerDay: signal([{ date: "2020-01-01", activities: [] }]),
					getActivitiesForDay: () => {},
					filterDay: () => [],
					postActivitiesForDay: () => {},
				}),
			],
		}).compileComponents();

		activityStore = TestBed.inject(ActivityStore);
		userService = TestBed.inject(UserService);
		fixture = TestBed.createComponent(ActivityPageRowComponent);
		fixture.componentRef.setInput("date", "2020-01-01");
		component = fixture.componentInstance;
	});

	it("should create", () => {
		spyOn(userService, "getSyncSettings").and.returnValue(
			of({ syncedAccountId: 123 } as StravaSyncedAccount)
		);
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.canSync).toBeTrue();
	});

	it("should set cansync to false when no synced account id is known", () => {
		spyOn(userService, "getSyncSettings").and.returnValue(
			of({ syncedAccountId: undefined } as StravaSyncedAccount)
		);
		fixture.detectChanges();
		expect(component).toBeTruthy();
		expect(component.canSync).toBeFalse();
	});

	it("should sync activities", () => {
		spyOn(activityStore, "getActivitiesForDay");
		spyOn(userService, "getSyncSettings").and.returnValue(of());
		fixture.detectChanges();
		component.syncActivities();
		expect(activityStore.getActivitiesForDay).toHaveBeenCalledWith({
			date: "2020-01-01",
			force: true,
		});
	});

	it("should open modal", () => {
		spyOn(userService, "getSyncSettings").and.returnValue(of());
		fixture.detectChanges();
		component.openModal();
		expect(component.activities).toEqual([]);
		expect(component.showModal).toBeTrue();
	});

	it("should change name of activity in modal", () => {
		component.modalActivities = [{ name: "run" }];
		component.changeName(
			{ target: { value: "walk" } } as unknown as KeyboardEvent,
			0
		);
		expect(component.modalActivities).toEqual([{ name: "walk" }]);
	});

	it("should change calories of activity in modal", () => {
		component.modalActivities = [{ name: "run", calories: 123 }];
		component.changeCalories(
			{ target: { value: "234" } } as unknown as KeyboardEvent,
			0
		);
		expect(component.modalActivities).toEqual([{ name: "run", calories: 234 }]);
	});

	it("should delete activity from modal", () => {
		component.modalActivities = [{ name: "run" }];
		component.deleteActivity(0);
		expect(component.modalActivities).toEqual([]);
	});

	it("should add activity to modal", () => {
		spyOn(userService, "getSyncSettings").and.returnValue(of());
		component.modalActivities = [];
		fixture.componentRef.setInput("date", "2020-01-01");
		fixture.detectChanges();
		component.activityForm.patchValue({ name: "run", calories: 123 });
		component.addActivity();
		expect(component.modalActivities).toEqual([
			{ name: "run", calories: 123, day: "2020-01-01" },
		]);
		expect(component.activityForm.value).toEqual({
			name: null,
			calories: null,
		});

		component.activityForm.patchValue({ name: "run" });
		component.addActivity();
		expect(component.modalActivities).toEqual([
			{ name: "run", calories: 123, day: "2020-01-01" },
		]);
		expect(component.activityForm.value).toEqual({
			name: "run",
			calories: null,
		});
	});

	it("should save activities", () => {
		spyOn(userService, "getSyncSettings").and.returnValue(of());
		spyOn(activityStore, "postActivitiesForDay");
		fixture.componentRef.setInput("date", "2020-01-01");
		fixture.detectChanges();
		component.modalActivities = [{ name: "run" }];
		component.showModal = true;
		component.saveActivities();
		expect(activityStore.postActivitiesForDay).toHaveBeenCalledWith({
			activities: [{ name: "run" }],
			date: "2020-01-01",
		});
		expect(component.showModal).toBeFalse();
		expect(component.modalActivities).toEqual([]);
	});
});
