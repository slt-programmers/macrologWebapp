import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { EditFoodComponent } from "./edit-food.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent } from "ng-mocks";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { foodActions } from "src/app/shared/store/actions/food.actions";


describe('EditFoodComponent', () => {
  let fixture: ComponentFixture<EditFoodComponent>;
  let component: EditFoodComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        FormsModule, ReactiveFormsModule,
        EditFoodComponent,
        MockComponent(ModalComponent)
    ],
    providers: [
        provideMockStore({})
    ]
}).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EditFoodComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title', () => {
    component.selectedFood = { portions: [] };
    component.ngOnInit();
    expect(component.title).toEqual('Add food');
    component.selectedFood = { id: 123, portions: [] };
    component.ngOnInit();
    expect(component.title).toEqual('Edit food');
  });

  it('should save food', () => {
    spyOn(store, 'dispatch');
    component.selectedFood = { name: 'new', protein: 1, fat: 2, carbs: 3, portions: [] };
    component.saveFood();
    expect(store.dispatch).toHaveBeenCalledWith(foodActions.post({
      id: undefined,
      name: 'new', protein: 1, fat: 2, carbs: 3, portions: []
    }));
  }); 

  it('should remove portion', () => {
    component.selectedFood = {portions: [{description: 'test'}]};
    component.removePortion(0);
    expect(component.selectedFood.portions).toEqual([]);
  });

  it('should check if new portion', () => {
    let result = component.isNewPortion({});
    expect(result).toBeTrue();
    result = component.isNewPortion({id: 0});
    expect(result).toBeTrue();
    result = component.isNewPortion({id: 1});
    expect(result).toBeFalse();
  });

  it('should add new portion', () => {
    component.selectedFood = {portions: []}
    component.addNewPortion();
    expect(component.selectedFood.portions).toEqual([{}]);
  });

});
