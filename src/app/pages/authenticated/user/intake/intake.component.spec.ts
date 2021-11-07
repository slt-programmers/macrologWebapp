import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { UserService } from "src/app/shared/services/user.service";
import { IntakeComponent } from "./intake.component"


describe('IntakeComponent', () => {
  let fixture: ComponentFixture<IntakeComponent>;
  let component: IntakeComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IntakeComponent,
        MockComponent(StepperComponent)
      ],
      providers: [
        MockProvider(UserService),

      ]
    }).compileComponents();

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(IntakeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
