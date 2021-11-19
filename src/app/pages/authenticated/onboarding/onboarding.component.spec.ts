import { ComponentFixture, TestBed } from "@angular/core/testing"
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockComponent, MockProvider } from "ng-mocks"
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { DishService } from "src/app/shared/services/dish.service"
import { UserService } from "src/app/shared/services/user.service";
import { OnboardingComponent } from "./onboarding.component"


describe('OnboardingComponent', () => {
  let fixture: ComponentFixture<OnboardingComponent>;
  let component: OnboardingComponent;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        OnboardingComponent,
        MockComponent(StepperComponent)
      ],
      providers: [
        MockProvider(UserService),

      ]
    }).compileComponents();

    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  
});
