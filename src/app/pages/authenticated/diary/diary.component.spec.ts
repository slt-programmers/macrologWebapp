import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs"
import { DatepickerComponent } from "src/app/shared/components/datepicker/datepicker.component"
import { StackDonutComponent } from "src/app/shared/components/stackdonut/stackdonut.component"
import { DiaryService } from "src/app/shared/services/diary.service"
import { ToastService } from "src/app/shared/services/toast.service"
import { UserService } from "src/app/shared/services/user.service"
import { selectTotalsForDate } from "src/app/shared/store/selectors/entries.selectors"
import { DiaryPageComponent } from "./diary-page/diary-page.component"
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
  let userService: UserService;
  let window: Window;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [DiaryComponent,
        MockComponent(StackDonutComponent),
        MockComponent(DatepickerComponent),
        MockComponent(DiaryPageComponent)],
    providers: [
        MockProvider(UserService),
        provideMockStore({}),
        MockProvider(MockWindow),
        { provide: Window, useValue: new MockWindow() }
    ]
}).compileComponents();

    userService = TestBed.inject(UserService);
    window = TestBed.inject(Window);
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DiaryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', async () => {
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(123);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getUserGoalStats).toHaveBeenCalled();
  });

  it('should init component without goals', () => {
    spyOn(userService, 'getUserGoalStats').and.returnValue(of(undefined));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(123);

    fixture.detectChanges();
    component.ngOnInit();
    expect(component.goalCal).toBeUndefined();
  });

  it('should init component with large window', async () => {
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getUserGoalStats).toHaveBeenCalled();
  });

  it('should change date', () => {
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);
    spyOn(store, 'select').and.returnValue(of({}));
    component.totals$ = undefined;
    component.changeDate('2022-01-01');
    expect(component.date).toEqual('2022-01-01');
    expect(component.totals$).toBeDefined();
  });

});
