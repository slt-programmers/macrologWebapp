import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { Dish } from "src/app/shared/model/dish";
import { Ingredient } from "src/app/shared/model/ingredient";
import { DishStore } from "src/app/shared/store/dish.store";
import { DishesComponent } from "./dishes.component";

describe("DishesComponent", () => {
	let fixture: ComponentFixture<DishesComponent>;
	let component: DishesComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DishesComponent],
			providers: [MockProvider(DishStore)],
		}).compileComponents();

		fixture = TestBed.createComponent(DishesComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should init component", () => {
		component.ngOnInit();
		expect(component.allDishes).toEqual([
			{ name: "dish1" } as unknown as Dish,
			{ name: "dish2" } as unknown as Dish,
		]);
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
					portion: {},
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

	// it('should add ingredient', () => {
	//   component.selectedDish = { name: 'name', ingredients: [] };
	//   component.addIngredient({ food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 } });
	//   expect(component.selectedDish).toEqual({
	//     name: 'name',
	//     ingredients: [{
	//       multiplier: 1,
	//       food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
	//     }]
	//   });
	// });

	// it('should save dish', () => {
	//   spyOn(component, 'closeModal');
	//   const dish = {
	//     name: 'dish', ingredients: [{
	//       multiplier: 1,
	//       food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
	//     }]
	//   }
	//   component.selectedDish = dish
	//   component.saveDish();
	//   expect(component.closeModal).toHaveBeenCalled();
	// });

	// it('should remove ingredient', () => {
	//   component.selectedDish = {
	//     name: 'dish', ingredients: [{
	//       multiplier: 1,
	//       food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 }
	//     }]
	//   }
	//   component.removeIngredient(0);
	//   expect(component.selectedDish).toEqual({ name: 'dish', ingredients: [] });
	// });

	// it('should change portion of food in dish', () => {
	//   const ingredient = {
	//     multiplier: 2,
	//     food: {
	//       id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
	//         { id: 1, description: 'portion2', grams: 150 },
	//         { id: 1, description: 'portion', grams: 50 },
	//       ] as Portion[]
	//     },
	//     portion: { id: 1, description: 'portion', grams: 50 },
	//   }
	//   component.portionChange(ingredient, { value: 'grams' });
	//   expect(ingredient.portion).toBeUndefined();
	//   expect(ingredient.multiplier).toEqual(1);

	//   component.portionChange(ingredient, { value: 'portion' });
	//   expect(ingredient.portion).toEqual({ id: 1, description: 'portion', grams: 50 });
	// });

	// it('should get step for portion input', () => {
	//   const ingredient = {
	//     multiplier: 2,
	//     food: {
	//       id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
	//         { id: 1, description: 'portion', grams: 50 }
	//       ] as Portion[]
	//     },
	//     portion: { id: 1, description: 'portion', grams: 50 },
	//   } as any;
	//   let result = component.getStep(ingredient);
	//   expect(result).toEqual(0.1);
	//   ingredient.portion = undefined
	//   result = component.getStep(ingredient);
	//   expect(result).toEqual(1);
	// });

	// it('should calculate multiplier', () => {
	//   const ingredient = {
	//     multiplier: 1,
	//     food: {
	//       id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
	//         { id: 1, description: 'portion', grams: 50 }
	//       ] as Portion[]
	//     },
	//     portion: { id: 1, description: 'portion', grams: 50 },
	//   } as any
	//   component.calculateMultiplier({ target: { value: 2 } }, ingredient);
	//   expect(ingredient.multiplier).toEqual(2);
	//   ingredient.portion = undefined;
	//   component.calculateMultiplier({ target: { value: 200 } }, ingredient);
	//   expect(ingredient.multiplier).toEqual(2);
	// });

	// it('should get value', () => {
	//   const ingredient = {
	//     multiplier: 2,
	//     food: {
	//       id: 1, name: 'food', protein: 1, fat: 2, carbs: 3, portions: [
	//         { id: 1, description: 'portion', grams: 50 }
	//       ] as Portion[]
	//     },
	//     portion: { id: 1, description: 'portion', grams: 50 },
	//   } as any
	//   let result = component.getValue(ingredient);
	//   expect(result).toEqual(2);
	//   ingredient.portion = undefined;
	//   result = component.getValue(ingredient);
	//   expect(result).toEqual(200);
	// });

	// it('should delete dish', () => {
	//   spyOn(component, 'closeModal');
	//   const dish = {
	//     name: 'dish',
	//     ingredients: [{ food: { id: 1, name: 'food', protein: 1, fat: 2, carbs: 3 } }]
	//   };
	//   component.selectedDish = dish;
	//   component.deleteDish();
	//   expect(component.closeModal).toHaveBeenCalled();
	// });
});
