import { TestBed } from "@angular/core/testing";
import { FoodService } from "./food.service";
import { MockProvider } from "ng-mocks";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Food } from "../model/food";

describe("FoodService", () => {
	let service: FoodService;
	let http: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [FoodService, MockProvider(HttpClient)],
		});

		http = TestBed.inject(HttpClient);
		service = TestBed.inject(FoodService);
	});

	it("should get food", () => {
		spyOn(http, "get");
		service.getFood();
		expect(http.get).toHaveBeenCalledWith("//" + environment.backend + "/food");
	});

	it("should post food", () => {
		const food: Food = {
			name: "food",
			protein: 1,
			fat: 2,
			carbs: 3,
		};
		spyOn(http, "post");
		service.postFood(food);
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/food",
			food
		);
	});
});
