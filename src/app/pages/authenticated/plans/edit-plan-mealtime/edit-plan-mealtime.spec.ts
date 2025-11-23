import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanMealtime } from './edit-plan-mealtime';

describe('EditPlanMealtime', () => {
  let component: EditPlanMealtime;
  let fixture: ComponentFixture<EditPlanMealtime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlanMealtime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanMealtime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
