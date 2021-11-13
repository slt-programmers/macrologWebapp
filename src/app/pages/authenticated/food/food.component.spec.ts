import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs";
import { FoodComponent } from "./food.component"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { selectAllFood, selectFoodLoading } from "src/app/shared/store/selectors/food.selectors";
import { Food } from "src/app/shared/model/food";


describe('FoodComponent', () => {
  let fixture: ComponentFixture<FoodComponent>;
  let component: FoodComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FoodComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllFood, value: [{ name: 'name', protein: 1, fat: 2, carbs: 3 } as Food] },
            { selector: selectFoodLoading, value: false }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(FoodComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if has next page', () => {
    spyOn(store, 'dispatch');
    const result = component.hasNextPage();
    expect(result).toBeFalse();
  });

});
