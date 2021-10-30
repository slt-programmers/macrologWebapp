import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockProvider } from "ng-mocks"
import { DishService } from "src/app/shared/services/dish.service"
import { DishesComponent } from "./dishes.component"


describe('DishesComponent', () => {
  let fixture: ComponentFixture<DishesComponent>;
  let component: DishesComponent;
  let dishService:DishService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DishesComponent
      ],
      providers: [
        MockProvider(DishService)
      ]
    }).compileComponents();

    dishService = TestBed.inject(DishService);
    fixture = TestBed.createComponent(DishesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
