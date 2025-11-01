import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GraphsComponent } from './graphs.component';
import { UserService } from 'src/app/shared/services/user.service';
import { MockProvider } from 'ng-mocks';
import { DiaryService } from 'src/app/shared/services/diary.service';
import { of } from 'rxjs';

describe('GraphsComponent', () => {
  let component: GraphsComponent;
  let fixture: ComponentFixture<GraphsComponent>;
  let diaryService: DiaryService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [GraphsComponent],
    providers: [
        MockProvider(DiaryService),
        MockProvider(UserService),
    ]
}).compileComponents();

    diaryService = TestBed.inject(DiaryService);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(GraphsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(diaryService, 'getMacrosPerDay').and.returnValue(of(
      [{ day: "2021-10-23", macro: { protein: 21.84, fat: 29.78, carbs: 4.48, calories: 373.3 } },
      { day: "2021-10-24", macro: { protein: 4.7, fat: 5.55, carbs: 1.1, calories: 73.15 } },
      { day: "2021-11-05", macro: { protein: 6.98, fat: 11.235, carbs: 1.16, calories: 133.675 } },
      { day: "2021-11-07", macro: { protein: 3.51, fat: 8.145, carbs: 6.21, calories: 112.185 } }]
    ))
    spyOn(userService, 'getUserGoalStats').and.returnValue(of(['100', '130', '40']));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    localStorage.clear();
  });
});
