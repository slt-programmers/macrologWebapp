import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { provideRouter } from "@angular/router";
import { MockComponent, MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { UserService } from "src/app/shared/services/user.service";
import { OnboardingComponent } from "./onboarding.component";


describe('OnboardingComponent', () => {
  let fixture: ComponentFixture<OnboardingComponent>;
  let component: OnboardingComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, OnboardingComponent,
        MockComponent(StepperComponent)],
      providers: [
        provideRouter([]),
        MockProvider(UserService),
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set next step', () => {
    component.userForm.patchValue({ name: 'test', birthday: '01-01-1990', gender: 'FEMALE', height: 165, weight: 65, activity: 1.375 });
    component.nextStep();
    expect(component.currentStep).toEqual(2);
  });

  it('should set previous step', () => {
    component.currentStep = 2;
    component.previousStep();
    expect(component.currentStep).toEqual(1);
  });

  it('should save usersettings', () => {
    spyOn(userService, 'addUserSetting').and.returnValue(of({}));
    component.saveUserSettings();
    expect(userService.addUserSetting).not.toHaveBeenCalled();
    component.userForm.patchValue({ name: 'test', birthday: '01-01-1990', gender: 'FEMALE', height: 165, weight: 65, activity: 1.375 });
    component.saveUserSettings();
    expect(userService.addUserSetting).toHaveBeenCalledTimes(6);
  });

});
