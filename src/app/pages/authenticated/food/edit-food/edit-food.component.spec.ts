import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent, MockProvider } from "ng-mocks";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { FoodStore } from "src/app/shared/store/food.store";
import { EditFoodComponent } from "./edit-food.component";

describe("EditFoodComponent", () => {
	let fixture: ComponentFixture<EditFoodComponent>;
	let component: EditFoodComponent;
	let foodStore: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				EditFoodComponent,
				MockComponent(ModalComponent),
			],
			providers: [
				MockProvider(FoodStore, {
					postFood: () => {},
				}),
			],
		}).compileComponents();

		foodStore = TestBed.inject(FoodStore);
		fixture = TestBed.createComponent(EditFoodComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should set title", () => {
		fixture.componentRef.setInput("selectedFood", { portions: [] });
		fixture.detectChanges();
		component.ngOnInit();
		expect(component.title).toEqual("Add food");
		fixture.componentRef.setInput("selectedFood", { id: 123, portions: [] });
		fixture.detectChanges();
		component.ngOnInit();
		expect(component.title).toEqual("Edit food");
	});

	it("should save food", () => {
		spyOn(foodStore, "postFood");
		fixture.componentRef.setInput("selectedFood", {
			name: "new",
			protein: 1,
			fat: 2,
			carbs: 3,
			portions: [],
		});
		fixture.detectChanges();
		component.saveFood();
		expect(foodStore.postFood).toHaveBeenCalledWith({
			id: undefined,
			name: "new",
			protein: 1,
			fat: 2,
			carbs: 3,
			portions: [],
		});
	});

	it("should remove portion", () => {
		fixture.componentRef.setInput("selectedFood", {
			portions: [{ description: "test" }],
		});
		fixture.detectChanges();
		component.removePortion(0);
		expect(component.selectedFood().portions).toEqual([]);
	});

	it("should check if new portion", () => {
		let result = component.isNewPortion({});
		expect(result).toBeTrue();
		result = component.isNewPortion({ id: 0 });
		expect(result).toBeTrue();
		result = component.isNewPortion({ id: 1 });
		expect(result).toBeFalse();
	});

	it("should add new portion", () => {
		fixture.componentRef.setInput("selectedFood", { portions: [] });
		fixture.detectChanges();
		component.addNewPortion();
		expect(component.selectedFood().portions).toEqual([{}]);
	});
});
