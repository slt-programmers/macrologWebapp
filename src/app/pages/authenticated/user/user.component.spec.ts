import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterOutlet, UserComponent],
    providers: [provideRouter([])]
}).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create user component', () => {
    expect(component).toBeTruthy();
  });
});
