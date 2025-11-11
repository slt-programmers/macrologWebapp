import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { selectEntries } from 'src/app/shared/store/selectors/entries.selectors';
import { ActivityPageRowComponent } from '../activity-page-row/activity-page-row.component';
import { EntryPageRowComponent } from '../entry-page-row/entry-page-row.component';

import { DiaryPageComponent } from './diary-page.component';

describe('DiaryPageComponent', () => {
  let component: DiaryPageComponent;
  let fixture: ComponentFixture<DiaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryPageComponent,
        MockComponent(EntryPageRowComponent),
        MockComponent(ActivityPageRowComponent)],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectEntries, value: [{ date: '2021-01-01', entries: [] },
              { date: '2020-01-02', entries: [{ protein: 123, fat: 123, carbs: 123, calories: 123 }] }]
            }
          ]
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiaryPageComponent);
    fixture.componentRef.setInput('date', '2020-01-02');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
