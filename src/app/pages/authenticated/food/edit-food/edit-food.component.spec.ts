import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MockComponent } from "ng-mocks";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { foodActions } from "src/app/shared/store/actions/food.actions";
import { EditFoodComponent } from "./edit-food.component";


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
    fixture.componentRef.setInput('selectedFood', { portions: [] })
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.title).toEqual('Add food');
    fixture.componentRef.setInput('selectedFood', { id: 123, portions: [] })
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.title).toEqual('Edit food');
  });

  it('should save food', () => {
    spyOn(store, 'dispatch');
    fixture.componentRef.setInput('selectedFood', { name: 'new', protein: 1, fat: 2, carbs: 3, portions: [] })
    fixture.detectChanges();
    component.saveFood();
    expect(store.dispatch).toHaveBeenCalledWith(foodActions.post({
      id: undefined,
      name: 'new', protein: 1, fat: 2, carbs: 3, portions: []
    }));
  });

  it('should remove portion', () => {
    fixture.componentRef.setInput('selectedFood', { portions: [{ description: 'test' }] })
    fixture.detectChanges();
    component.removePortion(0);
    expect(component.selectedFood().portions).toEqual([]);
  });

  it('should check if new portion', () => {
    let result = component.isNewPortion({});
    expect(result).toBeTrue();
    result = component.isNewPortion({ id: 0 });
    expect(result).toBeTrue();
    result = component.isNewPortion({ id: 1 });
    expect(result).toBeFalse();
  });

  it('should add new portion', () => {
    fixture.componentRef.setInput('selectedFood', { portions: [] })
    fixture.detectChanges();
    component.addNewPortion();
    expect(component.selectedFood().portions).toEqual([{}]);
  });

});
