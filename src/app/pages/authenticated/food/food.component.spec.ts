import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockProvider } from "ng-mocks"
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
  
});
