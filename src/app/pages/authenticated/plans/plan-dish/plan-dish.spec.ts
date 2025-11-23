import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDish } from './plan-dish';

describe('PlanDish', () => {
  let component: PlanDish;
  let fixture: ComponentFixture<PlanDish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDish);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
