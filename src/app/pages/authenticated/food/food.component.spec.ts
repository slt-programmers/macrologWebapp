import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FoodComponent } from "./food.component"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { selectAllFood, selectFoodLoading } from "src/app/shared/store/selectors/food.selectors";
import { Food } from "src/app/shared/model/food";
import { MockComponent } from "ng-mocks";
import { EditFoodComponent } from "./edit-food/edit-food.component";


describe('FoodComponent', () => {
  let fixture: ComponentFixture<FoodComponent>;
  let component: FoodComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FoodComponent,
        MockComponent(EditFoodComponent)],
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

  it('should find food match', () => {
    store.overrideSelector(selectAllFood, [
      { name: 'Name', protein: 1, fat: 2, carbs: 3 },
      { name: 'Other name', protein: 1, fat: 2, carbs: 3 },
      { name: 'Something else', protein: 1, fat: 2, carbs: 3 }
    ]);
    store.refreshState();
    let result = component.displayedFood;
    expect(result).toEqual([
      { name: 'Name', protein: 1, fat: 2, carbs: 3 },
      { name: 'Other name', protein: 1, fat: 2, carbs: 3 },
      { name: 'Something else', protein: 1, fat: 2, carbs: 3 }
    ]);
    component.searchInput = 'Na';
    component.findFoodMatch();
    expect(component.displayedFood).toEqual([
      { name: 'Name', protein: 1, fat: 2, carbs: 3 },
      { name: 'Other name', protein: 1, fat: 2, carbs: 3 }
    ]);
  });

  it('should open modal', () => {
    expect(component.modalIsVisible).toBeFalse();
    component.openModal(null);
    expect(component.selectedFood).toEqual({ portions: [] });
    expect(component.modalIsVisible).toBeTrue();

    component.modalIsVisible = false;
    component.openModal({ name: 'name', portions: [] });
    expect(component.selectedFood).toEqual({ name: 'name', portions: [] });
    expect(component.modalIsVisible).toBeTrue();
  });

  it('should close modal', () => {
    component.modalIsVisible = true;
    component.closeModal();
    expect(component.modalIsVisible).toBeFalse();
  });

  it('should clear search input', () => {
    component.searchInput = 'blabla';
    component.findFoodMatch();
    component.clearSearch();
    expect(component.searchInput).toEqual('');
    expect(component.displayedFood).toEqual([{ name: 'name', protein: 1, fat: 2, carbs: 3 }]);
  });

  it('should sort food', () => {
    store.overrideSelector(selectAllFood, [
      { name: 'Name', protein: 1, fat: 24, carbs: 13 },
      { name: 'Other name', protein: 31, fat: 2, carbs: 13 },
      { name: 'Something else', protein: 18, fat: 67, carbs: 43 }
    ]);
    store.refreshState();
    component.sortBy('protein');
    expect(component.displayedFood).toEqual([
      { name: 'Other name', protein: 31, fat: 2, carbs: 13 },
      { name: 'Something else', protein: 18, fat: 67, carbs: 43 },
      { name: 'Name', protein: 1, fat: 24, carbs: 13 }
    ]);
    component.sortBy('protein')
    expect(component.displayedFood).toEqual([
      { name: 'Name', protein: 1, fat: 24, carbs: 13 },
      { name: 'Something else', protein: 18, fat: 67, carbs: 43 },
      { name: 'Other name', protein: 31, fat: 2, carbs: 13 }
    ]);
    component.sortBy('carbs');
    expect(component.displayedFood).toEqual([
      { name: 'Something else', protein: 18, fat: 67, carbs: 43 },
      { name: 'Name', protein: 1, fat: 24, carbs: 13 },
      { name: 'Other name', protein: 31, fat: 2, carbs: 13 },
    ]);
  });

  it('should change display mode', () => {
    store.overrideSelector(selectAllFood, [
      { id: 1, name: 'Name', protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: 'Other name', protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: 'Something else', protein: 18, fat: 67, carbs: 43 }
    ]);
    store.refreshState();
    component.changeDisplay('percentage');
    expect(component.displayMode).toEqual('percentage');
    expect(component.displayedFood).toEqual([
      { id: 1, name: 'Name', protein: 2.631578947368421, fat: 63.1578947368421, carbs: 34.21052631578947 },
      { id: 2, name: 'Other name', protein: 67.3913043478261, fat: 4.3478260869565215, carbs: 28.26086956521739 },
      { id: 3, name: 'Something else', protein: 14.0625, fat: 52.34375, carbs: 33.59375 }
    ]);
    component.changeDisplay('grams');
    expect(component.displayMode).toEqual('grams');
    expect(component.displayedFood).toEqual([
      { id: 1, name: 'Name', protein: 1, fat: 24, carbs: 13 },
      { id: 2, name: 'Other name', protein: 31, fat: 2, carbs: 13 },
      { id: 3, name: 'Something else', protein: 18, fat: 67, carbs: 43 }
    ]);
  })
});
