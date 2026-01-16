import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper.component';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StepperComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(StepperComponent);
    fixture.componentRef.setInput('currentStep', 1)
    fixture.componentRef.setInput('numberOfSteps', 2)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.steps()).toEqual([1, 2]);
  });

});
