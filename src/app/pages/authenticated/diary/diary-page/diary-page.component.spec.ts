import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent, MockProvider } from "ng-mocks";
import { ActivityPageRowComponent } from "../activity-page-row/activity-page-row.component";
import { EntryPageRowComponent } from "../entry-page-row/entry-page-row.component";

import { signal } from "@angular/core";
import { EntryStore } from "src/app/shared/store/entry.store";
import { DiaryPageComponent } from "./diary-page.component";
import { ActivityStore } from "src/app/shared/store/activity.store";

describe("DiaryPageComponent", () => {
	let component: DiaryPageComponent;
	let fixture: ComponentFixture<DiaryPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				DiaryPageComponent,
				MockComponent(EntryPageRowComponent),
				MockComponent(ActivityPageRowComponent),
			],
			providers: [
				MockProvider(EntryStore, {
					getEntriesForDay: () => {},
					totalsForDay: signal({ protein: 0, fat: 0, carbs: 0, calories: 0 }),
				}),
				MockProvider(ActivityStore, {
					getActivitiesForDay: () => {},
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DiaryPageComponent);
		fixture.componentRef.setInput("date", "2020-01-02");
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
