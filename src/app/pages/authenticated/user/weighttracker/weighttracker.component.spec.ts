import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent, MockProvider } from "ng-mocks"
import { of } from "rxjs";
import { LinegraphComponent } from "src/app/shared/components/linegraph/linegraph.component";
import { StepperComponent } from "src/app/shared/components/stepper/stepper.component";
import { ToastService } from "src/app/shared/services/toast.service";
import { WeightService } from "src/app/shared/services/weight.service";
import { WeightTrackerComponent } from "./weighttracker.component"


describe('WeighttrackerComponent', () => {
  let fixture: ComponentFixture<WeightTrackerComponent>;
  let component: WeightTrackerComponent;
  let weightService: WeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        WeightTrackerComponent,
        MockComponent(StepperComponent),
        MockComponent(LinegraphComponent)
      ],
      providers: [
        MockProvider(WeightService),
        MockProvider(ToastService)
      ]
    }).compileComponents();

    weightService = TestBed.inject(WeightService);
    fixture = TestBed.createComponent(WeightTrackerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(weightService, 'getAllWeights').and.returnValue(of(
      [{ "id": 1, "weight": 68.0, "day": "2021-01-04" },
      { "id": 2, "weight": 67.8, "day": "2021-01-07" },
      { "id": 3, "weight": 55.0, "day": "2021-11-06" },
      { "id": 4, "weight": 66.0, "day": "2021-11-07" }]
    ))
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

});
