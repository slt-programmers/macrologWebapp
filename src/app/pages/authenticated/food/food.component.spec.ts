import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MockComponent, MockProvider } from "ng-mocks";
import { Food } from "src/app/shared/model/food";
import { FoodStore } from "src/app/shared/store/food.store";
import { EditFoodComponent } from "./edit-food/edit-food.component";
import { FoodComponent } from "./food.component";

describe("FoodComponent", () => {
  let fixture: ComponentFixture<FoodComponent>;
  let component: FoodComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FoodComponent, FontAwesomeModule, MockComponent(EditFoodComponent)],
      providers: [
        MockProvider(FoodStore, {
          food: signal([
            { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
            { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
            { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
          ]),
          getFood: () => { },
          loading: signal(false)
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should find food match", () => {
    expect(component.displayedFood).toEqual([
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
    ]);
    component.searchInput = "Na";
    component.findFoodMatch();
    expect(component.displayedFood).toEqual([
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
    ]);
  });

  it("should open modal", () => {
    expect(component.modalIsVisible).toBeFalse();
    component.openModal(null);
    expect(component.selectedFood).toEqual({ portions: [] } as unknown as Food);
    expect(component.modalIsVisible).toBeTrue();

    component.modalIsVisible = false;
    component.openModal({ name: "name", portions: [] } as unknown as Food);
    expect(component.selectedFood).toEqual({
      name: "name",
      portions: [],
    } as unknown as Food);
    expect(component.modalIsVisible).toBeTrue();
  });

  it("should close modal", () => {
    component.modalIsVisible = true;
    component.closeModal();
    expect(component.modalIsVisible).toBeFalse();
  });

  it("should clear search input", () => {
    component.searchInput = "blabla";
    component.findFoodMatch();
    component.clearSearch();
    expect(component.searchInput).toEqual("");
    expect(component.displayedFood).toEqual([
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
    ]);
  });

  it("should sort food", () => {
    component.sortBy("protein");
    expect(component.displayedFood).toEqual([
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
    ]);
    component.sortBy("protein");
    expect(component.displayedFood).toEqual([
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
    ]);
    component.sortBy("carbs");
    expect(component.displayedFood).toEqual([
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
    ]);
  });

  it("should change display mode", () => {
    component.changeDisplay("percentage");
    expect(component.displayMode).toEqual("percentage");
    expect(component.displayedFood).toEqual([
      {
        id: 1,
        name: "Name",
        protein: 2.631578947368421,
        fat: 63.1578947368421,
        carbs: 34.21052631578947,
      },
      {
        id: 2,
        name: "Other name",
        protein: 67.3913043478261,
        fat: 4.3478260869565215,
        carbs: 28.26086956521739,
      },
      {
        id: 3,
        name: "Something else",
        protein: 14.0625,
        fat: 52.34375,
        carbs: 33.59375,
      },
    ]);
    component.changeDisplay("grams");
    expect(component.displayMode).toEqual("grams");
    expect(component.displayedFood).toEqual([
      { id: 1, name: "Name", protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: "Other name", protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: "Something else", protein: 18, fat: 67, carbs: 43 },
    ]);
  });
});
