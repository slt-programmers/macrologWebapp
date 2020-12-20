import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebhooksComponent } from './webhooks.component';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

describe('WebhooksComponent', () => {
  let component: WebhooksComponent;
  let fixture: ComponentFixture<WebhooksComponent>;
  let toastService: ToastService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [WebhooksComponent],
      providers: [ToastService, UserService, HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(WebhooksComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });
});
