import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Entry } from "src/app/shared/model/entry";
import { Meal } from "src/app/shared/model/meal";
import { EntryPageRowComponent } from "./entry-page-row.component";
import { MockProvider } from "ng-mocks";
import { EntryStore } from "src/app/shared/store/entry.store";
import { signal } from "@angular/core";

describe("EntryPageRowComponent", () => {
	let component: EntryPageRowComponent;
	let fixture: ComponentFixture<EntryPageRowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EntryPageRowComponent],
			providers: [
				MockProvider(EntryStore, {
          filterDay: () => {},
          filterMeal: () => {},
					entriesPerDay: signal([
						{
							date: "2020-01-01",
							entries: [
								{
									food: { id: 1 },
									portion: { id: 2 },
									multiplier: 1,
									meal: Meal.Breakfast,
									macrosCalculated: {
										protein: 1,
										fat: 2,
										carbs: 3,
										calories: 4,
									},
								} as Entry,
							],
						},
					]),
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EntryPageRowComponent);
		fixture.componentRef.setInput("meal", Meal.Breakfast);
		fixture.componentRef.setInput("date", "2020-01-01");
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should open modal", () => {
		component.showModal = false;
		component.modalEntries = [];
		component.entries = [];
		component.openModal();
		expect(component.showModal).toBeTrue();
		expect(component.modalEntries).toEqual([]);
	});

	it("should change portion on modal entry", () => {
		component.modalEntries = [
			{ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, portion: { id: 1 } },
		] as any;
		component.changePortion({ target: { value: "2" } }as unknown as Event, 0);
		expect(component.modalEntries[0]).toEqual({
			food: { id: 1, portions: [{ id: 1 }, { id: 2 }] },
			portion: { id: 2 },
		} as any);
		component.changePortion({ target: { value: "grams" } }as unknown as Event, 0);
		expect(component.modalEntries[0]).toEqual({
			food: { id: 1, portions: [{ id: 1 }, { id: 2 }] },
			portion: undefined,
		} as any);
	});

	it("should change multiplier on modal entry", () => {
		component.modalEntries = [
			{
				food: { id: 1, portions: [{ id: 1 }, { id: 2 }] },
				portion: { id: 1 },
				multiplier: 1,
			},
		] as any;
		component.changeMultiplier({ target: { value: "2" } } as unknown as Event, 0);
		expect(component.modalEntries[0].multiplier).toEqual(2);
		component.modalEntries = [
			{ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, multiplier: 1 },
		] as any;
		component.changeMultiplier({ target: { value: "120" } }as unknown as Event, 0);
		expect(component.modalEntries[0].multiplier).toEqual(1.2);
	});

	it("should delete entry from modal", () => {
		component.modalEntries = [{ food: { id: 1 } }] as any;
		component.deleteEntry(0);
		expect(component.modalEntries).toEqual([]);
	});

});
