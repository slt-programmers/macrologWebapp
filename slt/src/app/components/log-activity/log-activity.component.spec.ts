import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LogActivityComponent } from './log-activity.component';
import { ToastService } from "../../services/toast.service";
import { ActivityService } from "../../services/activity.service";

describe('LogActivityComponent', () => {
  let component: LogActivityComponent;
  let fixture: ComponentFixture<LogActivityComponent>;
  let activityService: ActivityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogActivityComponent],
      providers: [ActivityService, ToastService],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogActivityComponent);
    component = fixture.componentInstance;
    activityService = TestBed.get(ActivityService);
    fixture.detectChanges();
  });

  it('should create log-activity component', () => {
    expect(component).toBeTruthy();
  });


});
