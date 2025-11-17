import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditDishComponent } from "./edit-dish.component";
import { DishStore } from "src/app/shared/store/dish.store";
import { MockComponent, MockProvider } from "ng-mocks";
import { AutocompleteFoodComponent } from "src/app/shared/components/autocomplete-food/autocomplete-food.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { FormsModule } from "@angular/forms";
import { FoodStore } from "src/app/shared/store/food.store";
import { signal } from "@angular/core";

describe("EditDishComponent", () => {
	let component: EditDishComponent;
	let fixture: ComponentFixture<EditDishComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				EditDishComponent,
				FormsModule,
				MockComponent(AutocompleteFoodComponent),
				MockComponent(ModalComponent),
			],
			providers: [
				MockProvider(DishStore, {
					deleteDish: () => {},
					postDish: () => {},
					dishes: signal([])
				}),
				MockProvider(FoodStore, {
					food: signal([])
				})
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EditDishComponent);
		fixture.componentRef.setInput("selectedDish", {
			name: "dish1",
			ingredients: [],
		});
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
