import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { ActivityService } from "../services/activity.service";
import { ActivityStore } from "./activity.store";
import { DateStore } from "./date.store";

describe("ActivityStore", () => {
	let store: any;
	let activityService: ActivityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ActivityStore, DateStore, MockProvider(ActivityService)],
		});

		activityService = TestBed.inject(ActivityService);
		store = TestBed.inject(ActivityStore);
	});

	it("should get activities for date", () => {
		const serviceSpy = spyOn(activityService, "getActivitiesForDay");
		serviceSpy.and.returnValue(of([]));
		store.getActivitiesForDay({ date: "2020-01-01", force: false });

		let result = store.activitiesPerDay();
		expect(result).toEqual([{ date: "2020-01-01", activities: [] }]);

		const activity1 = getSimpleActivity();
		serviceSpy.and.returnValue(of([activity1]));
		store.getActivitiesForDay({ date: "2020-01-01", force: false });
		expect(activityService.getActivitiesForDay).toHaveBeenCalledWith(
			"2020-01-01",
			false
		);
		result = store.activitiesPerDay();
		expect(result).toEqual([{ date: "2020-01-01", activities: [activity1] }]);

		const activity2 = getSimpleActivity();
		activity2.day = "2020-01-02";
		const activity3 = getSimpleActivity();
		activity3.day = "2020-01-02";
		serviceSpy.and.returnValue(of([activity2, activity3]));
		store.getActivitiesForDay({ date: "2020-01-02", force: false });
		result = store.activitiesPerDay();
		expect(result).toEqual([
			{ date: "2020-01-01", activities: [activity1] },
			{ date: "2020-01-02", activities: [activity2, activity3] },
		]);

		const activity4 = getSimpleActivity();
		serviceSpy.and.returnValue(of([activity4]));
		store.getActivitiesForDay({ date: "2020-01-01", force: false });
		result = store.activitiesPerDay();
		expect(result).toEqual([
			{ date: "2020-01-01", activities: [activity4] },
			{ date: "2020-01-02", activities: [activity2, activity3] },
		]);
	});

	it("should filter day", () => {
		const serviceSpy = spyOn(activityService, "getActivitiesForDay");
		const activity1 = getSimpleActivity();
		const activity2 = getSimpleActivity();
		serviceSpy.and.returnValue(of([activity1, activity2]));
		store.getActivitiesForDay({ date: "2020-01-01", force: false });

		let result = store.filterDay(store.activitiesPerDay(), "2020-01-01");
		expect(result).toEqual([activity1, activity2]);
		result = store.filterDay(store.activitiesPerDay(), "2020-01-03");
		expect(result).toEqual([]);
	});

	it("should post activities for day", () => {
		const activity1 = getSimpleActivity();
		const serviceSpy = spyOn(activityService, "postActivitiesForDay");
		serviceSpy.and.returnValue(of([activity1]));
		store.postActivitiesForDay({ activities: [activity1], date: "2020-01-01" });
		expect(activityService.postActivitiesForDay).toHaveBeenCalled();
		let result = store.activitiesPerDay();
		expect(result).toEqual([{ date: "2020-01-01", activities: [activity1] }]);

		serviceSpy.and.returnValue(of([activity1, activity1]));
		store.postActivitiesForDay({ activities: [activity1], date: "2020-01-01" });
		result = store.activitiesPerDay();
		expect(result).toEqual([
			{ date: "2020-01-01", activities: [activity1, activity1] },
		]);
	});
});

function getSimpleActivity() {
	return {
		id: 1,
		day: "2020-01-01",
		name: "gym",
		calories: 123,
	};
}
