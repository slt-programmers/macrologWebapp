import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditDishComponent } from "./edit-dish.component";
import { DishStore } from "src/app/shared/store/dish.store";
import { MockComponent, MockProvider } from "ng-mocks";
import { AutocompleteFoodComponent } from "src/app/shared/components/autocomplete-food/autocomplete-food.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { FormsModule } from "@angular/forms";
import { provideMockStore } from "@ngrx/store/testing";

describe("EditDishComponent", () => {
	let component: EditDishComponent;
	let fixture: ComponentFixture<EditDishComponent>;
	let dishStore: any;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				EditDishComponent,
				MockComponent(AutocompleteFoodComponent),
				MockComponent(ModalComponent),
			],
			providers: [MockProvider(DishStore, {
				deleteDish: () => {},
				postDish: () => {}
			}), provideMockStore({})],
		}).compileComponents();

		dishStore = TestBed.inject(DishStore);

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
