import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMealtime } from './plan-mealtime';

describe('PlanMealtime', () => {
  let component: PlanMealtime;
  let fixture: ComponentFixture<PlanMealtime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMealtime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMealtime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
