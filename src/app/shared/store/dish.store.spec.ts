import { TestBed } from "@angular/core/testing";
import { DishStore } from "./dish.store";
import { MockProvider } from "ng-mocks";
import { HttpClient } from "@angular/common/http";
import { DishService } from "../services/dish.service";
import { of } from "rxjs";
import { Dish } from "../model/dish";

describe("DishStore", () => {
	let store: any;
	let service: DishService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DishStore, MockProvider(DishService)],
		});

		service = TestBed.inject(DishService);
		store = TestBed.inject(DishStore);
	});

	it("should get dishes", () => {
		spyOn(service, "getDishes").and.returnValue(of([getSimpleDish()]));
    store.getDishes();
    const result = store.dishes();
    expect(result).toEqual([getSimpleDish()]);
	});
});

function getSimpleDish(): Dish {
	return {
		id: 1,
		name: "dish1",
		ingredients: [
			{ food: { id: 1, name: "food1", protein: 1, fat: 2, carbs: 3 } },
		],
	};
}
