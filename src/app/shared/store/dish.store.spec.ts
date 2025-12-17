import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { Dish } from "../model/dish";
import { DishService } from "../services/dish.service";
import { DishStore } from "./dish.store";

describe("DishStore", () => {
	let store: any;
	let service: DishService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DishStore, MockProvider(DishService)],
		});

		service = TestBed.inject(DishService);
	});

	it("should get dishes", () => {
		spyOn(service, "getDishes").and.returnValue(of([getSimpleDish()]));
		store = TestBed.inject(DishStore);

		store.getDishes();
		const result = store.dishes();
		expect(result).toEqual([getSimpleDish()]);
	});

	it("should post dish", () => {
		spyOn(service, "getDishes").and.returnValue(of([getSimpleDish()]));
		spyOn(service, "postDish").and.returnValue(of(undefined));
		store = TestBed.inject(DishStore);
		const dish = getSimpleDish();
		dish.name = "newdish";
		store.postDish(dish);
		expect(service.postDish).toHaveBeenCalledOnceWith(dish);
	});
});

function getSimpleDish(): Dish {
	return {
		id: 1,
		name: "dish1",
		ingredients: [
			{
				id: 1,
				multiplier: 1,
				food: {
					id: 1,
					name: "food1",
					protein: 1,
					fat: 2,
					carbs: 3,
					portions: [],
				},
			},
		],
	};
}
