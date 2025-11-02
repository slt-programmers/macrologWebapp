import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Meal } from 'src/app/shared/model/meal';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectEntriesState } from 'src/app/shared/store/selectors/entries.selectors';

import { EntryPageRowComponent } from './entry-page-row.component';
import { Entry } from 'src/app/shared/model/entry';

describe('EntryPageRowComponent', () => {
  let component: EntryPageRowComponent;
  let fixture: ComponentFixture<EntryPageRowComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryPageRowComponent],
      providers: [
        provideMockStore({
          selectors: [{
            selector: selectEntriesState,
            value: {
              data: [{
                date: '2020-01-01',
                entries: [{
                  food: { id: 1 }, portion: { id: 2 }, multiplier: 1, meal: Meal.Breakfast,
                  macrosCalculated: { protein: 1, fat: 2, carbs: 3, calories: 4 }
                } as Entry]
              }]
            }
          }]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EntryPageRowComponent);
    fixture.componentRef.setInput('meal', Meal.Breakfast);
    fixture.componentRef.setInput('date', '2020-01-01');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should get entries for date and meal on change', () => {
  //   component.entries = [];
  //   fixture.componentRef.setInput('date', '2020-01-01');
  //   fixture.componentRef.setInput('meal', Meal.Breakfast);
  //   fixture.detectChanges();
  //   expect(component.entries).toEqual([{ food: { id: 1 }, portion: { id: 2 }, multiplier: 1, meal: Meal.Breakfast }])
  // });

  it('should open modal', () => {
    component.showModal = false;
    component.modalEntries = undefined;
    component.entries = [];
    component.openModal();
    expect(component.showModal).toBeTrue();
    expect(component.modalEntries).toEqual([]);
  });

  it('should change portion on modal entry', () => {
    component.modalEntries = [{ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, portion: { id: 1 } }];
    component.changePortion({ target: { value: '2' } }, 0);
    expect(component.modalEntries[0]).toEqual({ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, portion: { id: 2 } });
    component.changePortion({ target: { value: 'grams' } }, 0);
    expect(component.modalEntries[0]).toEqual({ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, portion: undefined });
  });

  it('should change multiplier on modal entry', () => {
    component.modalEntries = [{ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, portion: { id: 1 }, multiplier: 1 }];
    component.changeMultiplier({ target: { value: '2' } }, 0);
    expect(component.modalEntries[0].multiplier)
      .toEqual(2);
    component.modalEntries = [{ food: { id: 1, portions: [{ id: 1 }, { id: 2 }] }, multiplier: 1 }];
    component.changeMultiplier({ target: { value: '120' } }, 0);
    expect(component.modalEntries[0].multiplier).toEqual(1.2);
  });

  // it('should add entry to modal entries', () => {
  //   component.modalEntries = [];
  //   fixture.componentRef.setInput('date', '2020-01-01');
  //   fixture.componentRef.setInput('meal', Meal.Breakfast);
  //   fixture.detectChanges();
  //   component.addEntry({
  //     dish: {
  //       ingredients: [
  //         {
  //           food: { id: 1, name: 'food1', portions: [{ id: 1, description: 'portion1' }, { id: 2, description: 'portion2' }] },
  //           portion: { id: 1, description: 'portion1' },
  //           multiplier: 2
  //         }, {
  //           food: { id: 2, name: 'food2', portions: [{ id: 3, description: 'portion3' }] },
  //           portion: undefined,
  //           multiplier: 5
  //         }
  //       ]
  //     }, food: undefined
  //   });
  //   expect(component.modalEntries[0]).toEqual({
  //     food: { id: 1, name: 'food1', portions: [{ id: 1, description: 'portion1' }, { id: 2, description: 'portion2' }] },
  //     meal: Meal.Breakfast,
  //     day: '2020-01-01',
  //     portion: { id: 1, description: 'portion1' },
  //     multiplier: 2
  //   });
  //   expect(component.modalEntries[1]).toEqual({
  //     food: { id: 2, name: 'food2', portions: [{ id: 3, description: 'portion3' }] },
  //     meal: Meal.Breakfast,
  //     day: '2020-01-01',
  //     portion: undefined,
  //     multiplier: 5
  //   });

  //   component.addEntry({
  //     food: {
  //       id: 4,
  //       portions: [{ id: 1 }]
  //     }
  //   });
  //   expect(component.modalEntries[2]).toEqual({
  //     food: { id: 4, portions: [{ id: 1 }] },
  //     meal: Meal.Breakfast,
  //     day: '2020-01-01',
  //     portion: { id: 1 },
  //     multiplier: 1
  //   });
  //   component.addEntry({ food: { id: 5 } });
  //   expect(component.modalEntries[3]).toEqual({
  //     food: { id: 5 },
  //     meal: Meal.Breakfast,
  //     day: '2020-01-01',
  //     portion: undefined,
  //     multiplier: 1
  //   });
  // });

  it('should delete entry from modal', () => {
    component.modalEntries = [{ food: { id: 1 } }];
    component.deleteEntry(0);
    expect(component.modalEntries).toEqual([]);
  });

  // it('should save entries', () => {
  //   spyOn(store, 'dispatch');
  //   component.showModal = true;
  //   fixture.componentRef.setInput('date', '2020-01-01');
  //   fixture.componentRef.setInput('meal', Meal.Breakfast);
  //   fixture.detectChanges();
  //   component.modalEntries = [{
  //     food: { id: 1, portions: [{ id: 2 }] }, portion: { id: 2 }, multiplier: undefined,
  //     meal: Meal.Breakfast, day: '2020-01-01'
  //   }];
  //   component.saveEntries();
  //   expect(store.dispatch).not.toHaveBeenCalled();
  //   expect(component.showModal).toBeTrue();
  //   component.modalEntries[0].multiplier = 4;
  //   component.saveEntries();
  //   expect(store.dispatch).toHaveBeenCalledWith(entriesActions.post(
  //     [{
  //       food: { id: 1, portions: [{ id: 2 }] }, portion: { id: 2 }, multiplier: 4,
  //       meal: Meal.Breakfast, day: '2020-01-01'
  //     }], { date: '2020-01-01', meal: Meal.Breakfast }
  //   ));
  //   expect(component.showModal).toBeFalse();
  //   expect(component.modalEntries).toBeUndefined();
  // });
});
