import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plan } from './plan';
import { MockProvider } from 'ng-mocks';
import { PlanStore } from 'src/app/shared/store/plan.store';
import { provideRouter } from '@angular/router';

describe('Plan', () => {
  let component: Plan;
  let fixture: ComponentFixture<Plan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plan],
      providers: [
        provideRouter([]),
        MockProvider(PlanStore, {
        getPlan: () => {}
      })]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
