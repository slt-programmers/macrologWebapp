import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { StepperComponent } from 'src/app/shared/components/stepper/stepper.component';
import { Gender } from 'src/app/shared/model/gender';
import { UserService } from 'src/app/shared/services/user.service';
import { IntakeComponent } from './intake.component';

describe('IntakeComponent', () => {
  let fixture: ComponentFixture<IntakeComponent>;
  let component: IntakeComponent;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IntakeComponent,
        MockComponent(StepperComponent)],
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
      name: 'C',
      gender: Gender.Female,
      age: 32,
      birthday: '1989-03-26',
      height: 166,
      currentWeight: 66.0,
      activity: 1.375,
      goalProtein: 119,
      goalFat: 53,
      goalCarbs: 236
    }));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should open and close modal', () => {
    spyOn(userService, 'getUserSettings').and.returnValue(of({
      name: 'C',
      age: 32,
      gender: Gender.Female,
      birthday: '1989-03-26',
      height: 166,
      currentWeight: 66.0,
      activity: 1.375,
      goalProtein: 119,
      goalFat: 53,
      goalCarbs: 236
    }));
    component.ngOnInit();
    component.openModal();
    expect(component.showModal).toBeTrue();
    expect(component.protein).toEqual(119);
    expect(component.fat).toEqual(53);
    expect(component.carbs).toEqual(236);
    expect(component.calories).toEqual(1897);

    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should fill goals according to standard ratios', () => {
    spyOn(userService, 'getUserSettings').and.returnValue(of({
      name: 'C',
      age: 32,
      gender: Gender.Female,
      birthday: '1989-03-26',
      height: 166,
      currentWeight: 66.0,
      activity: 1.375,
      goalProtein: 110,
      goalFat: 60,
      goalCarbs: 240
    }));
    component.ngOnInit();
    component.fillStandard();
    expect(component.calories).toEqual(1865);
    expect(component.protein).toEqual(119);
    expect(component.fat).toEqual(53);
    expect(component.carbs).toEqual(228);
  });

  it('should save intake', () => {
    spyOn(userService, 'getUserSettings').and.returnValue(of({
      name: 'C',
      age: 32,
      gender: Gender.Female,
      birthday: '1989-03-26',
      height: 166,
      currentWeight: 66.0,
      activity: 1.375,
      goalProtein: 110,
      goalFat: 60,
      goalCarbs: 236
    }));
    spyOn(userService, 'putUserSetting').and.returnValue(of({}));
    component.ngOnInit();
    component.openModal();
    component.fillStandard();
    component.saveIntake();
    expect(userService.putUserSetting).toHaveBeenCalledTimes(3);
    expect(component.goalProtein).toEqual(119);
    expect(component.goalFat).toEqual(53);
    expect(component.goalCarbs).toEqual(228);
  });
});
