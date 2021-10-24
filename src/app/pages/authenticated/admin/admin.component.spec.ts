import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComponent } from './admin.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MockProvider } from 'ng-mocks';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let toastService: ToastService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [AdminComponent],
      providers: [
        MockProvider(ToastService), 
        MockProvider(UserService), 
        MockProvider(HttpClient)],
      schemas: [],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('should check if admin', () => {
    localStorage.setItem('currentUser', JSON.stringify({admin: true}));
    const result = component.isAdmin();
    expect(result).toBeTrue();
  });
});
