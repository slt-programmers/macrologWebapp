import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GraphsComponent } from './analytics.component';

describe('GraphsComponent', () => {
  let component: GraphsComponent;
  let fixture: ComponentFixture<GraphsComponent>;
  let toastService: ToastService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [GraphsComponent],
      providers: [ToastService, UserService, HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsComponent);
    component = fixture.componentInstance;
    toastService = TestBed.get(ToastService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.clear();
  })

});
