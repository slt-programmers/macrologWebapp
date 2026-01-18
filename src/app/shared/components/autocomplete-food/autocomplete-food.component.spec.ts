import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { MockProvider } from "ng-mocks";
import { Dish } from "src/app/shared/model/dish";
import { DishStore } from "../../store/dish.store";
import { FoodStore } from "../../store/food.store";
import { AutocompleteFoodComponent } from "./autocomplete-food.component";

describe("AutocompleteFoodComponent", () => {
	let component: AutocompleteFoodComponent;
	let fixture: ComponentFixture<AutocompleteFoodComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, AutocompleteFoodComponent],
			providers: [
				MockProvider(DishStore, {
					dishes: signal({
						name: "dish1",
						ingredients: [
							{ food: { id: 1, name: "food1", protein: 1, fat: 2, carbs: 3 } },
							{ food: { id: 2, name: "food2", protein: 4, fat: 5, carbs: 6 } },
						],
					}),
				}),
				MockProvider(FoodStore, {
					food: signal([
						{ id: 1, name: "food1", protein: 1, fat: 2, carbs: 3 },
						{ id: 2, name: "food2", protein: 4, fat: 5, carbs: 6 },
					]),
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AutocompleteFoodComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should find food match", () => {
		component.searchables = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
			{ food: { name: "Def", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		component.foodName = "A";
		expect(component.foodMatch).toEqual([]);
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		let result = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		component.foodName = "C";
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		result = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		component.foodName = "Aa";
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		result = [];
		expect(component.foodMatch).toEqual(result);

		component.findFoodMatch({ data: null } as InputEvent);
		expect(component.foodMatch).toEqual(result);
	});

	it("should find dish match", () => {
		component.searchables = [
			{ food: undefined, dish: { name: "Abc", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
			{ food: undefined, dish: { name: "Def", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
		];
		component.foodName = "A";
		expect(component.foodMatch).toEqual([]);
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		let result = [{ food: undefined, dish: { name: "Abc", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0}  } }] as any[];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{ food: undefined, dish: { name: "Abc", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
			{ food: undefined, dish: { name: "Cde", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
		];
		component.foodName = "C";
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		result = [
			{ food: undefined, dish: { name: "Abc", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
			{ food: undefined, dish: { name: "Cde", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} } },
		];
		expect(component.foodMatch).toEqual(result);

		component.searchables = [
			{
				food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] },
				dish: { name: "Abc with Def", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0} },
			},
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		component.foodName = "c";
		component.findFoodMatch({ data: "somedata" } as InputEvent);
		result = [
			{
				food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] },
				dish: { name: "Abc with Def", ingredients: [], macrosCalculated: {protein: 0, fat: 0, carbs: 0, calories: 0}  },
			},
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		expect(component.foodMatch).toEqual(result);
	});

	it("should show autocomplete dropdown on focus", () => {
		spyOn(component, "getDescription");
		const input = fixture.debugElement.query(By.css("#autoInput"));
		input.nativeElement.dispatchEvent(new Event("focus"));
		component.foodMatch = [
			{ food: { name: "Abc", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
			{ food: { name: "Cde", protein: 1, fat: 2, carbs: 3, portions: [] }, dish: undefined },
		];
		fixture.detectChanges();
		expect(component.getDescription).toHaveBeenCalled();
	});

	it("should get food or dish description", () => {
		const dish = { name: "Somedish" } as Dish;
		let result = component.getDescription({ food: undefined, dish: dish });
		expect(result).toEqual(dish.name + " (dish)");

		const food = { name: "Somefood", protein: 1, fat: 2, carbs: 3 , portions: []};
		result = component.getDescription({ food: food, dish: dish });
		expect(result).toEqual(dish.name + " (dish)");

		result = component.getDescription({ food: food, dish: undefined });
		expect(result).toEqual(food.name);
	});
});
