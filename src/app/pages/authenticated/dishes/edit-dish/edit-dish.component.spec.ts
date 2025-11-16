import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { DishStore } from "src/app/shared/store/dish.store";
import { EditDishComponent } from "./edit-dish.component";

describe("EditDish", () => {
	let component: EditDishComponent;
	let fixture: ComponentFixture<EditDishComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EditDishComponent],
			providers: [MockProvider(DishStore)],
		}).compileComponents();

		fixture = TestBed.createComponent(EditDishComponent);
		fixture.componentRef.setInput("selectedDish", { ingredients: [] });
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
