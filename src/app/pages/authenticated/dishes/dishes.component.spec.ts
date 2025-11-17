import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { Dish } from "src/app/shared/model/dish";
import { Ingredient } from "src/app/shared/model/ingredient";
import { DishStore } from "src/app/shared/store/dish.store";
import { DishesComponent } from "./dishes.component";
import { signal } from "@angular/core";

describe("DishesComponent", () => {
	let fixture: ComponentFixture<DishesComponent>;
	let component: DishesComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DishesComponent],
			providers: [
				MockProvider(DishStore, {
					getDishes: () => {},
					dishes: signal([
						{ name: "dish1" } as unknown as Dish,
						{ name: "dish2" } as unknown as Dish,
					]),
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DishesComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should open and close modal", () => {
		component.openModal(null);
		expect(component.modalIsVisible).toBeTrue();
		component.closeModal();
		expect(component.modalIsVisible).toBeFalse();
		component.openModal({
			id: 1,
			name: "dish",
			ingredients: [
				{
					food: {
						id: 1,
						name: "name",
						protein: 1,
						fat: 2,
						carbs: 3,
						portions: [{ id: 1, description: "desc", grams: 50 }],
					},
				},
			],
		});
		expect(component.selectedDish).toEqual({
			id: 1,
			name: "dish",
			ingredients: [
				{
					food: {
						id: 1,
						name: "name",
						protein: 1,
						fat: 2,
						carbs: 3,
						portions: [{ id: 1, description: "desc", grams: 50 }],
					},
				},
			],
		});
	});

	it("should get description", () => {
		const ingredient: Ingredient = {
			portion: { id: 1, description: "portionDesc" },
			multiplier: 1,
			food: {
				portions: [{ id: 1, description: "portionDesc" }],
			} as any,
		};
		let result = component.getIngredientDescription(ingredient);
		expect(result).toEqual("1 portionDesc");
		ingredient.portion = undefined;
		result = component.getIngredientDescription(ingredient);
		expect(result).toEqual("100 gram");
	});

	it("should get total", () => {
		const result = component.getTotal({ macrosCalculated: 123 } as any);
		expect(result).toEqual(123);
	});

});
