import { DatePipe } from "@angular/common"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs"
import { DatepickerComponent } from "src/app/shared/components/datepicker/datepicker.component"
import { LogActivityComponent } from "src/app/shared/components/log-activity/log-activity.component"
import { LogMealComponent } from "src/app/shared/components/log-meal/log-meal.component"
import { AddFoodModalComponent } from "src/app/shared/components/modals/add-food-modal/add-food-modal.component"
import { StackDonutComponent } from "src/app/shared/components/stackdonut/stackdonut.component"
import { ActivityService } from "src/app/shared/services/activity.service"
import { DiaryService } from "src/app/shared/services/diary.service"
import { ToastService } from "src/app/shared/services/toast.service"
import { UserService } from "src/app/shared/services/user.service"
import { DiaryComponent } from "./diary.component"

class MockWindow {
  private _innerWidth: number;

  get innerWidth() {
    return this._innerWidth;
  }
  set innerWidth(width: number) {
    this._innerWidth = width;
  }
}

describe('DiaryComponent', () => {
  let fixture: ComponentFixture<DiaryComponent>;
  let component: DiaryComponent;
  let activityService: ActivityService;
  let userService: UserService;
  let diaryService: DiaryService;
  let window: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ActivityService),
        MockProvider(UserService),
        MockProvider(DiaryService),
        MockProvider(ToastService),
        MockProvider(MockWindow),
        { provide: Window, useValue: new MockWindow() }
      ],
      declarations: [
        DiaryComponent,
        LogMealComponent,
        MockComponent(LogActivityComponent),
        MockComponent(StackDonutComponent),
        MockComponent(AddFoodModalComponent),
        MockComponent(DatepickerComponent),
      ]
    }).compileComponents();

    activityService = TestBed.inject(ActivityService);
    userService = TestBed.inject(UserService);
    diaryService = TestBed.inject(DiaryService);
    window = TestBed.inject(Window);

    fixture = TestBed.createComponent(DiaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', async () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({}));
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOn(diaryService, 'getLogsForDate').and.returnValue(of([]));
    spyOn(activityService, 'getActivitiesForDate').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(123);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
  });

  it('should init component with large window', async () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({}));
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOn(diaryService, 'getLogsForDate').and.returnValue(of([]));
    spyOn(activityService, 'getActivitiesForDate').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
  });

  it('should init component with usersettings', async () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({ syncedAccountId: 'someId' }));
    spyOn(userService, 'getUserGoalStats').and.returnValue(of(undefined));
    spyOn(diaryService, 'getLogsForDate').and.returnValue(of([]));
    spyOn(activityService, 'getActivitiesForDate').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(123);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    expect(component.activititiesSync).toBeTrue();
  });

  it('should refresh', () => {
    spyOn(diaryService, 'getLogsForDate').and.returnValue(of([{}]));
    spyOn(activityService, 'getActivitiesForDate').and.returnValue(of([{}]));
    const pipe = new DatePipe('en-US');
    component.refresh();
    expect(component.allLogs).toEqual([{}]);
    expect(component.activitiesLogs).toEqual([{}]);
    expect(diaryService.getLogsForDate).toHaveBeenCalledWith(pipe.transform(new Date(), 'yyyy-MM-dd'));
  });

  it('should force sync', () => {
    spyOn(activityService, 'getActivitiesForDateForced').and.returnValue(of([{}]));
    const pipe = new DatePipe('en-US');
    component.forceSync();
    expect(component.activitiesLogs).toEqual([{}]);
    expect(activityService.getActivitiesForDateForced)
      .toHaveBeenCalledWith(pipe.transform(new Date(), 'yyyy-MM-dd'));
  });

  it('should get total for macro', () => {
    component.breakfastLogs = [{ macrosCalculated: { protein: 123 } }];
    component.lunchLogs = [{ macrosCalculated: { protein: 234 } }];
    component.dinnerLogs = [{ macrosCalculated: { protein: 345 } }];
    component.snacksLogs = [{ macrosCalculated: { protein: 456 } }];
    let result = component.getTotal('protein');
    expect(result).toEqual(1158);
  });

  it('should get different day', () => {
    component.displayDate = new Date(2020, 0, 1);
    component.breakfastOpen = true;
    component.lunchOpen = true;
    component.dinnerOpen = true;
    component.snacksOpen = true;
    component.activitiesOpen = true;
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOn(diaryService, 'getLogsForDate').and.returnValue(of([{}]));
    spyOn(activityService, 'getActivitiesForDate').and.returnValue(of([{}]));
    component.getDifferentDay(new Date(2020, 1, 1));
    expect(component.displayDate).toEqual(new Date(2020, 1, 1));
    expect(component.breakfastOpen).toBeFalse();
    expect(component.lunchOpen).toBeFalse();
    expect(component.dinnerOpen).toBeFalse();
    expect(component.snacksOpen).toBeFalse();
    expect(component.activitiesOpen).toBeFalse();
  });

  it('should open modal', () => {
    component.modalIsVisible = false;
    component.openModal();
    expect(component.modalIsVisible).toBeTrue();
  });

  it('should close modal', () => {
    component.modalIsVisible = true;
    component.closeModal();
    expect(component.modalIsVisible).toBeFalse();
  });

  it('should handle document click', () => {
    component.breakfastEref = {
      logMealEref: { nativeElement: { contains: function () { return true } } }
    }
    component.lunchEref = {
      logMealEref: { nativeElement: { contains: function () { return true } } }
    }
    component.dinnerEref = {
      logMealEref: { nativeElement: { contains: function () { return true } } }
    }
    component.snacksEref = {
      logMealEref: { nativeElement: { contains: function () { return true } } }
    }
    component.activitiesEref = {
      logActivityEref: { nativeElement: { contains: function () { return true } } }
    }
    const card = fixture.debugElement.nativeElement.querySelector('.card');
    card.click();

    expect(component.breakfastOpen).toBeTrue();
    expect(component.lunchOpen).toBeTrue();
    expect(component.dinnerOpen).toBeTrue();
    expect(component.snacksOpen).toBeTrue();
    expect(component.activitiesOpen).toBeTrue();

    component.breakfastOpen = false;
    document.getElementsByClassName('card')[0].setAttribute('class', 'trash');
    const trash = fixture.debugElement.nativeElement.querySelector('.trash');
    trash.click();
    expect(component.breakfastOpen).toBeFalse();
  });

});
