import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthenticationService } from 'src/app/shared/services/auth.service';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { MockComponent, MockProvider } from 'ng-mocks';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
    imports: [HomeComponent,
        MockComponent(NavigationComponent)],
    providers: [
        MockProvider(AuthenticationService)
    ],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
