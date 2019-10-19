import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { HealthcheckService } from './services/healthcheck.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Renderer2 } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let healthcheckService: HealthcheckService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]), BrowserAnimationsModule],
      declarations: [AppComponent],
      providers: [HealthcheckService, HttpClient, HttpHandler, Renderer2],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.get(HealthcheckService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app component', fakeAsync(() => {
    const healthSpy = spyOn(healthcheckService, 'checkState').and.returnValue(of(true));
  }));

});
