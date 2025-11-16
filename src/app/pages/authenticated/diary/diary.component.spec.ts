import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent, MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { DatepickerComponent } from "src/app/shared/components/datepicker/datepicker.component";
import { StackDonutComponent } from "src/app/shared/components/stackdonut/stackdonut.component";
import { UserService } from "src/app/shared/services/user.service";
import { DiaryPageComponent } from "./diary-page/diary-page.component";
import { DiaryComponent } from "./diary.component";
import { EntryStore } from "src/app/shared/store/entries.store";
import { signal } from "@angular/core";

describe("DiaryComponent", () => {
	let fixture: ComponentFixture<DiaryComponent>;
	let component: DiaryComponent;
	let userService: UserService;
	let entriesStore: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				DiaryComponent,
				MockComponent(DatepickerComponent),
				MockComponent(StackDonutComponent),
				MockComponent(DiaryPageComponent),
			],
			providers: [
				MockProvider(UserService),
				MockProvider(EntryStore, {
					totalsForDay: signal({ protein: 0, fat: 0, carbs: 0, calories: 0 }),
					setDisplayDate: () => {},
					getEntriesForDay: () => {},
				}),
			],
		}).compileComponents();

		userService = TestBed.inject(UserService);
		entriesStore = TestBed.inject(EntryStore);
		fixture = TestBed.createComponent(DiaryComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should change date", () => {
		spyOn(userService, "getUserGoalStats").and.returnValue(of([]));
		spyOn(entriesStore, "setDisplayDate");
		component.changeDate("2022-01-01");
		expect(component.date).toEqual("2022-01-01");
	});
});
