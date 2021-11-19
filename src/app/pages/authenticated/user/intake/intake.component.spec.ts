import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs";
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
    spyOn(userService, 'getUserSettings').and.returnValue(of({
      name: "C",
      gender: "FEMALE",
      age: 32,
      birthday: "1989-03-26",
      height: 166,
      currentWeight: 66.0,
      activity: 1.375,
      goalProtein: 119,
      goalFat: 53,
      goalCarbs: 236
    }))
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

});
