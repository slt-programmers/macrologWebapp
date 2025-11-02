import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';
import { selectActivitiesDate, selectActivitiesLoading, selectActivitiesState } from 'src/app/shared/store/selectors/activities.selectors';

import { ActivityPageRowComponent } from './activity-page-row.component';

describe('ActivityPageRowComponent', () => {
  let component: ActivityPageRowComponent;
  let fixture: ComponentFixture<ActivityPageRowComponent>;
  let store: MockStore;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ActivityPageRowComponent],
      providers: [
        MockProvider(UserService),
        provideMockStore({
          selectors: [
            { selector: selectActivitiesLoading, value: false },
            { selector: selectActivitiesState, value: { data: [{ date: '2020-01-02', activities: [{ name: 'run', calories: 123 }] }] } },
            { selector: selectActivitiesDate('2020-01-01'), value: [{ name: 'run', calories: 123 }] }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(ActivityPageRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({ syncedAccountId: 123 }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.canSync).toBeTrue();
  });

  it('should set cansync to false when no synced account id is known', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({ syncedAccountId: undefined }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.canSync).toBeFalse();
  });

  it('should sync activities', () => {
    spyOn(store, 'dispatch');
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    fixture.componentRef.setInput('date', '2020-01-01')
    fixture.detectChanges();
    component.syncActivities();
    expect(store.dispatch).toHaveBeenCalledWith(activitiesActions.get(true, { date: '2020-01-01', sync: true }));
  });

  it('should show sync button', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    store.overrideSelector(selectActivitiesLoading, true);
    store.refreshState();
    fixture.detectChanges();
    component.canSync = false;
    expect(component.showSync()).toBeFalse();
    store.overrideSelector(selectActivitiesLoading, false);
    store.refreshState();
    fixture.detectChanges();
    expect(component.showSync()).toBeFalse();
    component.canSync = true;
    expect(component.showSync()).toBeTrue();
  });

  it('should open modal', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    store.overrideSelector(selectActivitiesLoading, true);
    store.refreshState();
    fixture.detectChanges();
    component.modalActivities = undefined;
    component.activities = [];
    component.showModal = false;
    component.openModal();
    expect(component.showModal).toBeFalse();
    store.overrideSelector(selectActivitiesLoading, false);
    store.refreshState();
    fixture.detectChanges();
    component.openModal();
    expect(component.activities).toEqual([]);
    expect(component.showModal).toBeTrue();
  });

  it('should change name of activity in modal', () => {
    component.modalActivities = [{ name: 'run' }];
    component.changeName({ target: { value: 'walk' } }, 0);
    expect(component.modalActivities).toEqual([{ name: 'walk' }]);
  });

  it('should change calories of activity in modal', () => {
    component.modalActivities = [{ name: 'run', calories: 123 }];
    component.changeCalories({ target: { value: '234' } }, 0);
    expect(component.modalActivities).toEqual([{ name: 'run', calories: 234 }]);
  });

  it('should delete activity from modal', () => {
    component.modalActivities = [{ name: 'run' }];
    component.deleteActivity(0);
    expect(component.modalActivities).toEqual([]);
  });

  it('should add activity to modal', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    component.modalActivities = [];
    fixture.componentRef.setInput('date', '2020-01-01')
    fixture.detectChanges();
    component.activityForm.patchValue({ name: 'run', calories: 123 });
    component.addActivity();
    expect(component.modalActivities).toEqual([{ name: 'run', calories: 123, day: '2020-01-01' }]);
    expect(component.activityForm.value).toEqual({ name: null, calories: null });

    component.activityForm.patchValue({ name: 'run' });
    component.addActivity();
    expect(component.modalActivities).toEqual([{ name: 'run', calories: 123, day: '2020-01-01' }]);
    expect(component.activityForm.value).toEqual({ name: 'run', calories: null });
  });

  it('should save activities', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of());
    spyOn(store, 'dispatch');
    fixture.componentRef.setInput('date', '2020-01-01')
    fixture.detectChanges();
    component.modalActivities = [{ name: 'run' }];
    component.showModal = true;
    component.saveActivities();
    expect(store.dispatch).toHaveBeenCalledWith(activitiesActions.post([{ name: 'run' }], '2020-01-01'));
    expect(component.showModal).toBeFalse();
    expect(component.modalActivities).toBeUndefined();
  });

});
