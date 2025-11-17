import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { Food } from "../model/food";
import { FoodService } from "../services/food.service";
import { FoodStore } from "./food.store";

describe("FoodStore", () => {
	let store: any;
	let service: FoodService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FoodStore, MockProvider(FoodService)],
		});

		service = TestBed.inject(FoodService);
	});

	it("should get food", () => {
		spyOn(service, "getFood").and.returnValue(of([getSimpleFood()]));
		store = TestBed.inject(FoodStore);

		store.getFood();
		const result = store.food();
		expect(result).toEqual([getSimpleFood()]);
	});

	it('should post food', () => {
		spyOn(service, "getFood").and.returnValue(of([getSimpleFood()]));
		spyOn(service, 'postFood').and.returnValue(of(undefined));
		store = TestBed.inject(FoodStore);
		const food = getSimpleFood();
		food.name = 'newfood'
		store.postFood(food);
		expect(service.postFood).toHaveBeenCalledOnceWith(food)
	})
});

function getSimpleFood(): Food {
	return {
		id: 1,
		name: "food1",
    protein: 1, 
    fat: 2,
    carbs: 3
	};
}
