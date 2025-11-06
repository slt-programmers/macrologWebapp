import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs";
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { Gender } from "src/app/shared/model/gender";
import { ToastService } from "src/app/shared/services/toast.service";
import { UserService } from "src/app/shared/services/user.service";
import { PersonalComponent } from "./personal.component"


describe('PersonalComponent', () => {
  let fixture: ComponentFixture<PersonalComponent>;
  let component: PersonalComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, PersonalComponent,
        MockComponent(StepperComponent)],
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
    spyOn(userService, 'getUserSettings').and.returnValue(of({
      name: "C",
      gender: Gender.Female,
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
