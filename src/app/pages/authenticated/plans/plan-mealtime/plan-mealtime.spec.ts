import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMealtime } from './plan-mealtime';
import { MockProvider } from 'ng-mocks';
import { PlanStore } from 'src/app/shared/store/plan.store';
import { provideRouter } from '@angular/router';
import { Meal } from 'src/app/shared/model/meal';
import { Weekday } from 'src/app/shared/model/weekday';

describe('PlanMealtime', () => {
  let component: PlanMealtime;
  let fixture: ComponentFixture<PlanMealtime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMealtime],
      providers: [MockProvider(PlanStore, {}), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMealtime);
    fixture.componentRef.setInput('mealtime', {meal: Meal.Breakfast, weekday: Weekday.Monday, ingredients: []})
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
