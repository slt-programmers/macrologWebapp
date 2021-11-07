import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockComponent, MockProvider } from "ng-mocks"
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
    expect(component).toBeTruthy();
  });
  
});
