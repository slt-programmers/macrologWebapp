import { AddFoodModalComponent } from './add-food-modal.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Macros } from 'src/app/shared/model/macros';
import { Portion } from 'src/app/shared/model/portion';
import { FoodService } from 'src/app/shared/services/food.service';
import { ScrollBehaviourService } from 'src/app/shared/services/scroll-behaviour.service';
import { Food } from 'src/app/shared/model/food';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

describe('AddFoodModal', () => {
  let component: AddFoodModalComponent;
  let fixture: ComponentFixture<AddFoodModalComponent>;
  let foodService: FoodService;
  let scrollBehaviourService: ScrollBehaviourService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFoodModalComponent],
      providers: [
        MockProvider(ScrollBehaviourService),
        MockProvider(FoodService),
      ],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFoodModalComponent);
    component = fixture.componentInstance;
    foodService = TestBed.inject(FoodService);
    scrollBehaviourService = TestBed.inject(ScrollBehaviourService);
    fixture.detectChanges();
  });

  it('should create add food modal', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    expect(component).toBeTruthy();
  });

  it('should init add food modal correctly', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.ngOnInit();
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalled();
    expect(component.title).toEqual('Add food');

    component.food = { name: 'food', protein: 1, fat: 2, carbs: 3 };
    component.ngOnInit();
    expect(component.title).toEqual('Edit food');
    expect(component.name).toEqual('food');
    expect(component.portions).toEqual([]);

    component.food = { name: 'second', protein: 4, fat: 5, carbs: 6 };
    const portion = new Portion(111, 'piece',{} as Macros);
    component.food.portions = [portion];
    component.ngOnInit();
    expect(component.portions).toEqual([
      Object({ grams: 111, description: 'piece', macros: Object({}) }),
    ]);
  });

  it('should save food', ()  => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    spyOn(foodService, 'addFood').and.returnValue(of({}));

    component.name = 'food';
    component.protein = 1;
    component.fat = 2;
    component.carbs = 3;

    const food: Food = { name: 'food', protein: 1, fat: 2, carbs: 3 };
    food.portions = [];
    component.saveFood();
    expect(foodService.addFood).toHaveBeenCalledWith(food);
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
  });
  
  it('should save edited existing food', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    spyOn(foodService, 'addFood').and.returnValue(of({}))
    
    component.food = { name: 'food', protein: 0, fat: 0, carbs: 0 };
    component.food.id = 1234;
    component.name = 'food';
    component.protein = 1;
    component.fat = 2;
    component.carbs = 3;
    
    const food: Food = { name: 'food', protein: 1, fat: 2, carbs: 3 };
    food.id = 1234;
    food.portions = [];
    component.saveFood();
    expect(foodService.addFood).toHaveBeenCalledWith(food);
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
  });

  it('should close the modal', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should check if portion is new', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    const portion = new Portion(111, 'piece');
    portion.id = undefined;
    let result = component.isNewPortion(portion);
    expect(result).toBeTruthy();

    portion.id = null;
    result = component.isNewPortion(portion);
    expect(result).toBeTruthy();

    portion.id = 0;
    result = component.isNewPortion(portion);
    expect(result).toBeTruthy();

    portion.id = 42;
    result = component.isNewPortion(portion);
    expect(result).toBeFalsy();
  });

  it('should add a new portion to the list', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.addNewPortion();
    expect(component.portions.length).toEqual(1);
    component.addNewPortion();
    expect(component.portions.length).toEqual(2);
  });

  it('should remove portion from list', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.portions = [new Portion(111, 'piece'), new Portion(222, 'slice')];
    component.removePortion(1);
    expect(component.portions).toEqual([new Portion(111, 'piece')]);
  });

});
