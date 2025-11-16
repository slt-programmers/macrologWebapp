import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditDishComponent } from "./edit-dish.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("EditDish", () => {
	let component: EditDishComponent;
	let fixture: ComponentFixture<EditDishComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EditDishComponent],
			providers: [provideMockStore({})],
		}).compileComponents();

		fixture = TestBed.createComponent(EditDishComponent);
    fixture.componentRef.setInput('selectedDish', {ingredients: []})
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
