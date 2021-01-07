import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { authenticatedRoutes } from './authenticated-routing.module';
import { DiaryComponent } from './diary/diary.component';
import { FoodComponent } from './food/food.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './graphs/graphs.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthenticatedComponent } from './authenticated.component';
import { PersonalComponent } from './user/personal/personal.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { IntakeComponent } from './user/intake/intake.component';
import { WeightTrackerComponent } from './user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './user/connectivity/connectivity.component';
import { AccountComponent } from './user/account/account.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { MatTableModule } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthGuard } from 'src/app/pages/authenticated/auth.guard';
import { DiaryService } from 'src/app/shared/services/diary.service';
import { DishService } from 'src/app/shared/services/dish.service';
import { FoodService } from 'src/app/shared/services/food.service';
import { HealthcheckService } from 'src/app/shared/services/healthcheck.service';
import { ScrollBehaviourService } from 'src/app/shared/services/scroll-behaviour.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

describe('Router authenticated', () => {
  let location: Location;
  let router: Router;
  let authGuard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(authenticatedRoutes),
        FormsModule,
        MatTableModule,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        ScrollBehaviourService,
        HealthcheckService,
        ToastService,
        AuthGuard,
        FoodService,
        DishService,
        DiaryService,
        UserService,
        AdminService,
        ActivityService,
      ],
      declarations: [
        AuthenticatedComponent,
        DiaryComponent,
        FoodComponent,
        UserComponent,
        AdminComponent,
        AppComponent,
        DishesComponent,
        GraphsComponent,
        OnboardingComponent,
        PersonalComponent,
        UserManagementComponent,
        IntakeComponent,
        WeightTrackerComponent,
        ConnectivityComponent,
        AccountComponent,
        WebhooksComponent,
        MailComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authGuard = TestBed.inject(AuthGuard);
    router.initialNavigation();
    spyOn(authGuard, 'canActivate').and.returnValue(true);
  });

  it('should navigate to diary', fakeAsync(() => {
    router.navigate(['/log']).then(() => {
      expect(location.path()).toBe('/log');
    });
    tick();
  }));

  it('should navigate to user', fakeAsync(() => {
    router.navigate(['/user']).then(() => {
      expect(location.path()).toBe('/user/personal');
    });
    tick();
  }));

  it('should navigate to admin', fakeAsync(() => {
    router.navigate(['/admin']).then(() => {
      expect(location.path()).toBe('/admin/usermanagement');
    });
    tick();
  }));

  it('should navigate to onboarding', fakeAsync(() => {
    router.navigate(['/onboarding']).then(() => {
      expect(location.path()).toBe('/onboarding');
    });
    tick();
  }));

  it('should navigate to food', fakeAsync(() => {
    router.navigate(['/food']).then(() => {
      expect(location.path()).toBe('/food');
    });
    tick();
  }));

  it('should navigate to dishes', fakeAsync(() => {
    router.navigate(['/dishes']).then(() => {
      expect(location.path()).toBe('/dishes');
    });
    tick();
  }));

  it('should navigate to graphs', fakeAsync(() => {
    router.navigate(['/graphs']).then(() => {
      expect(location.path()).toBe('/graphs');
    });
    tick();
  }));
});
