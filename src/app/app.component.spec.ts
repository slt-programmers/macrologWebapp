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
import { of, throwError } from 'rxjs';
import { ToastComponent } from './shared/components/toast/toast.component';
import { MockComponent, MockProvider } from 'ng-mocks';


class MockDocument {
  getElementsByTagName(tag: string) { }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let healthcheckService: HealthcheckService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]),
      ],
      declarations: [
        AppComponent,
        MockComponent(ToastComponent)
      ],
      providers: [
        { provide: Document, useValue: new MockDocument() },
        MockProvider(HealthcheckService)
      ]
    }).compileComponents();

    document = TestBed.inject(Document);
    healthcheckService = TestBed.inject(HealthcheckService);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set theme on init', fakeAsync(() => {
    localStorage.setItem('theme', 'dark');
    spyOn(healthcheckService, 'checkState').and.returnValue(of(true));
    const addSpy = jasmine.createSpy();
    spyOn(document, 'getElementsByTagName').and.returnValue([{classList: {add: addSpy}}] as any)
    component.ngOnInit();
    tick();
    expect(document.getElementsByTagName).toHaveBeenCalledWith('body');
    expect(addSpy).toHaveBeenCalledWith('theme--dark')
  }));

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
