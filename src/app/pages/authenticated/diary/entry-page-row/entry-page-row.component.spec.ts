import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Portion } from 'src/app/shared/model/portion';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectEntriesDateMeal, selectEntriesState } from 'src/app/shared/store/selectors/entries.selectors';

import { EntryPageRowComponent } from './entry-page-row.component';

describe('EntryPageRowComponent', () => {
  let component: EntryPageRowComponent;
  let fixture: ComponentFixture<EntryPageRowComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntryPageRowComponent],
      providers: [
        provideMockStore({
          selectors: [{
            selector: selectEntriesState,
            value: {
              data: [{
                date: '2020-01-01',
                entries: [{ food: { id: 1 }, portion: { id: 2 }, multiplier: 1, meal: 'BREAKFAST' }]
              }]
            }
          }]
        })
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EntryPageRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get entries for date and meal on change', () => {
    component.entries = [];
    component.date = '2020-01-01';
    component.meal = 'BREAKFAST';
    component.ngOnChanges({});
    expect(component.entries).toEqual([{ food: { id: 1 }, portion: { id: 2 }, multiplier: 1, meal: 'BREAKFAST' }])
  });

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

  it('should add entry to modal entries', () => {
    component.modalEntries = [];
    component.meal = 'Breakfast';
    component.date = '2020-01-01';
    component.addEntry({
      dish: {
        ingredients: [
          {
            food: { id: 1, name: 'food1', portions: [{ id: 1, description: 'portion1' }, { id: 2, description: 'portion2' }] },
            portion: { id: 1, description: 'portion1' },
            multiplier: 2
          }, {
            food: { id: 2, name: 'food2', portions: [{ id: 3, description: 'portion3' }] },
            portion: undefined,
            multiplier: 5
          }
        ]
      }, food: undefined
    });
    expect(component.modalEntries[0]).toEqual({
      food: { id: 1, name: 'food1', portions: [{ id: 1, description: 'portion1' }, { id: 2, description: 'portion2' }] },
      meal: 'BREAKFAST',
      day: '2020-01-01',
      portion: { id: 1, description: 'portion1' },
      multiplier: 2
    });
    expect(component.modalEntries[1]).toEqual({
      food: { id: 2, name: 'food2', portions: [{ id: 3, description: 'portion3' }] },
      meal: 'BREAKFAST',
      day: '2020-01-01',
      portion: undefined,
      multiplier: 5
    });

    component.addEntry({
      food: {
        id: 4,
        portions: [{ id: 1 }]
      }
    });
    expect(component.modalEntries[2]).toEqual({
      food: { id: 4, portions: [{ id: 1 }] },
      meal: 'BREAKFAST',
      day: '2020-01-01',
      portion: { id: 1 },
      multiplier: 1
    });
    component.addEntry({ food: { id: 5 } });
    expect(component.modalEntries[3]).toEqual({
      food: { id: 5 },
      meal: 'BREAKFAST',
      day: '2020-01-01',
      portion: undefined,
      multiplier: 1
    });
  });

  it('should delete entry from modal', () => {
    component.modalEntries = [{ food: { id: 1 } }];
    component.deleteEntry(0);
    expect(component.modalEntries).toEqual([]);
  });

  it('should save entries', () => {
    spyOn(store, 'dispatch');
    component.showModal = true;
    component.date = '2020-01-01';
    component.meal = 'BREAKFAST';
    component.modalEntries = [{
      food: { id: 1, portions: [{ id: 2 }] }, portion: { id: 2 }, multiplier: undefined,
      meal: 'BREAKFAST', day: '2020-01-01'
    }];
    component.saveEntries();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.showModal).toBeTrue();
    component.modalEntries[0].multiplier = 4;
    component.saveEntries();
    expect(store.dispatch).toHaveBeenCalledWith(entriesActions.post(
      [{
        food: { id: 1, portions: [{ id: 2 }] }, portion: { id: 2 }, multiplier: 4,
        meal: 'BREAKFAST', day: '2020-01-01'
      }], { date: '2020-01-01', meal: 'BREAKFAST' }
    ));
    expect(component.showModal).toBeFalse();
    expect(component.modalEntries).toBeUndefined();
  });
});
