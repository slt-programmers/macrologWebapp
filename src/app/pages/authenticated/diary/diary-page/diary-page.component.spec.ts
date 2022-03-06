import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectEntries, selectTotalsForDate } from 'src/app/shared/store/selectors/entries.selectors';
import { ActivityPageRowComponent } from '../activity-page-row/activity-page-row.component';
import { EntryPageRowComponent } from '../entry-page-row/entry-page-row.component';

import { DiaryPageComponent } from './diary-page.component';

describe('DiaryPageComponent', () => {
  let component: DiaryPageComponent;
  let fixture: ComponentFixture<DiaryPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiaryPageComponent,
        MockComponent(EntryPageRowComponent),
        MockComponent(ActivityPageRowComponent)
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectEntries, value: [{ date: '2021-01-01', entries: [] },
              { date: '2020-01-02', entries: [{ protein: 123, fat: 123, carbs: 123, calories: 123 }] }]
            }
            // {selector: selectTotalsForDate('2020-01-02'), value: {protein: 123, fat: 123, carbs: 123, calories: 123}}
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DiaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get entries and activities on change date', () => {
    spyOn(store, 'dispatch');
    component.date = '2020-01-02';
    component.ngOnChanges({
      date: {
        previousValue: '2020-01-01',
        currentValue: '2020-01-02', isFirstChange: () => false, firstChange: false
      }
    } as SimpleChanges);
    expect(store.dispatch).toHaveBeenCalledWith(entriesActions.get(false, '2020-01-02'));
    expect(store.dispatch).toHaveBeenCalledWith(activitiesActions.get(false, { date: '2020-01-02', sync: false }));
  });

  it('should not get entries and activities on change other than date', () => {
    spyOn(store, 'dispatch');
    component.date = '2020-01-02';
    component.ngOnChanges({} as SimpleChanges);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
