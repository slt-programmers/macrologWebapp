import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HealthcheckService } from './shared/services/healthcheck.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ToastComponent } from './shared/components/toast/toast.component';
import { MockComponent, MockProvider } from 'ng-mocks';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let healthcheckService: HealthcheckService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]),
        BrowserAnimationsModule,
      ],
      declarations: [
        AppComponent,
        MockComponent(ToastComponent)
      ],
      providers: [
        MockProvider(HealthcheckService)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.inject(HealthcheckService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app component', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(of(true));
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(false);
  }));

  it('should do healthcheck unauthorized', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(
      throwError({ status: 403 })
    );
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(false);
  }));

  it('should do healthcheck random error', fakeAsync(() => {
    spyOn(healthcheckService, 'checkState').and.returnValue(
      throwError({ status: 500 })
    );
    component.ngOnInit();
    tick();
    expect(component.isAsleep()).toEqual(true);
  }));
});
