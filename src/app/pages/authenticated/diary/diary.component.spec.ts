import { ComponentFixture, TestBed } from "@angular/core/testing"
import { provideMockStore } from "@ngrx/store/testing"
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs"
import { DatepickerComponent } from "src/app/shared/components/datepicker/datepicker.component"
import { StackDonutComponent } from "src/app/shared/components/stackdonut/stackdonut.component"
import { DiaryService } from "src/app/shared/services/diary.service"
import { ToastService } from "src/app/shared/services/toast.service"
import { UserService } from "src/app/shared/services/user.service"
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(UserService),
        provideMockStore({}),
        MockProvider(MockWindow),
        { provide: Window, useValue: new MockWindow() }
      ],
      declarations: [
        DiaryComponent,
        MockComponent(StackDonutComponent),
        MockComponent(DatepickerComponent),
        MockComponent(DiaryPageComponent)
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService);
    window = TestBed.inject(Window);

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

  it('should init component with large window', async () => {
    spyOn(userService, 'getUserGoalStats').and.returnValue(of([]));
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);

    fixture.detectChanges();
    component.ngOnInit();
    expect(userService.getUserGoalStats).toHaveBeenCalled();
  });

});
