import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityPageRowComponent } from './activity-page-row.component';

describe('ActivityPageRowComponent', () => {
  let component: ActivityPageRowComponent;
  let fixture: ComponentFixture<ActivityPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityPageRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
