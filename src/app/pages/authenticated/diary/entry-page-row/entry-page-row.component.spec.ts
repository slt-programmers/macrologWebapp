import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPageRowComponent } from './entry-page-row.component';

describe('DiaryPageRowComponent', () => {
  let component: EntryPageRowComponent;
  let fixture: ComponentFixture<EntryPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryPageRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
