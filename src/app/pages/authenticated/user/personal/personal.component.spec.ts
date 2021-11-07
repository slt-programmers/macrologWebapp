import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent, MockProvider } from "ng-mocks"
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { ToastService } from "src/app/shared/services/toast.service";
import { UserService } from "src/app/shared/services/user.service";
import { PersonalComponent } from "./personal.component"


describe('PersonalComponent', () => {
  let fixture: ComponentFixture<PersonalComponent>;
  let component: PersonalComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule, ReactiveFormsModule],
      declarations: [
        PersonalComponent,
        MockComponent(StepperComponent)
      ],
      providers: [
        MockProvider(UserService),
        MockProvider(ToastService)
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(PersonalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
