import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockProvider } from "ng-mocks"
import { of } from "rxjs";
import { FoodService } from "src/app/shared/services/food.service";
import { FoodComponent } from "./food.component"


describe('FoodComponent', () => {
  let fixture: ComponentFixture<FoodComponent>;
  let component: FoodComponent;
  let foodService:FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FoodComponent
      ],
      providers: [
        MockProvider(FoodService)
      ]
    }).compileComponents();

    foodService = TestBed.inject(FoodService);
    fixture = TestBed.createComponent(FoodComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () =>{
    spyOn(foodService, 'getAllFood').and.returnValue(of([
      {id: 1, name: 'food1', protein: 1, fat: 2, carbs: 3},
      {id: 2, name: 'food2', protein: 2, fat: 3, carbs: 4}
    ]));
    component.ngOnInit();
    expect(component.isLoading).toBeFalse();
    expect(foodService.getAllFood).toHaveBeenCalled(); 
  });

  it('should check if has next page', () => {
    spyOn(foodService, 'getAllFood').and.returnValue(of([
      {id: 1, name: 'food1', protein: 1, fat: 2, carbs: 3},
      {id: 2, name: 'food2', protein: 2, fat: 3, carbs: 4}
    ]));
    component.ngOnInit();
    const result = component.hasNextPage();
    expect(result).toBeFalse();
  })
  
});
