import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs";
import { Dish } from "src/app/shared/model/dish";
import { Food } from "src/app/shared/model/food";
import { Ingredient } from "src/app/shared/model/ingredient";
import { DishService } from "src/app/shared/services/dish.service"
import { FoodService } from "src/app/shared/services/food.service";
import { DishesComponent } from "./dishes.component"


describe('DishesComponent', () => {
  let fixture: ComponentFixture<DishesComponent>;
  let component: DishesComponent;
  let dishService: DishService;
  let foodService: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DishesComponent
      ],
      providers: [
        MockProvider(DishService),
        MockProvider(FoodService)
      ]
    }).compileComponents();

    dishService = TestBed.inject(DishService);
    foodService = TestBed.inject(FoodService);
    fixture = TestBed.createComponent(DishesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    spyOn(foodService, 'getAllFood').and.returnValue(of([]));
    spyOn(dishService, 'getAllDishes').and.returnValue(of([{ name: 'dish2' }, { name: 'dish1' }]));
    component.ngOnInit();
    expect(component.allDishes).toEqual([{ name: 'dish1' }, { name: 'dish2' }]);
    expect(dishService.getAllDishes).toHaveBeenCalled();
  });

  it('should open and close modal', () => {
    spyOn(dishService, 'getAllDishes').and.returnValue(of([]));
    component.openModal(null);
    expect(component.modalIsVisible).toBeTrue();
    component.closeModal();
    expect(component.modalIsVisible).toBeFalse();
    expect(dishService.getAllDishes).toHaveBeenCalled();
  });

  it('should get portion', () => {
    const ingredient: Ingredient = { food: { portions: [{ id: 1 }] } }
    let result = component.getPortion(ingredient, 1);
    expect(result).toEqual({ id: 1 });
    result = component.getPortion(ingredient, 2);
    expect(result).toEqual({});
  });

  it('should get description', () => {
    const ingredient: Ingredient = {
      portion: { id: 1, description: 'portionDesc' }, multiplier: 1, food: {
        portions: [
          { id: 1, description: 'portionDesc' }]
      }
    };
    let result = component.getIngredientDescription(ingredient);
    expect(result).toEqual('1 portionDesc');
    ingredient.portion = undefined;
    result = component.getIngredientDescription(ingredient);
    expect(result).toEqual('100 gram');
  });

  it('should get total', () => {
    const result = component.getTotal({ macrosCalculated: 123 });
    expect(result).toEqual(123);
  });

  it('should open modal', () => {
    component.openModal(undefined);
    expect(component.modalTitle).toEqual('Make a dish');
    expect(component.selectedDish).toEqual({name: '', ingredients: []});

    const dish = {name: 'dish', ingredients: [{name: 'food'} as Food]} as Dish
    component.openModal(dish);
    expect(component.modalTitle).toEqual('Edit dish');
    expect(component.selectedDish).toEqual(dish);
  });
  
});
