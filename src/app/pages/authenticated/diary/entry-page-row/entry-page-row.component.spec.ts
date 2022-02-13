import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { EntryPageRowComponent } from './entry-page-row.component';

describe('EntryPageRowComponent', () => {
  let component: EntryPageRowComponent;
  let fixture: ComponentFixture<EntryPageRowComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryPageRowComponent ],
      providers:[
        provideMockStore({})
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EntryPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
