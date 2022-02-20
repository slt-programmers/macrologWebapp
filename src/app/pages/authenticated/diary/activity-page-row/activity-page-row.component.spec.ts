import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

import { ActivityPageRowComponent } from './activity-page-row.component';

describe('ActivityPageRowComponent', () => {
  let component: ActivityPageRowComponent;
  let fixture: ComponentFixture<ActivityPageRowComponent>;
  let store: MockStore;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ActivityPageRowComponent ],
      providers: [
        MockProvider(UserService),
        provideMockStore({})
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ActivityPageRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
