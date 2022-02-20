import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
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
        provideMockStore({})
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
});
