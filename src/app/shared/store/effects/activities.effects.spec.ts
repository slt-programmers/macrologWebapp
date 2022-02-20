import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MockProvider } from "ng-mocks";
import { of, throwError } from "rxjs";
import { Activity } from "../../model/activity";
import { activitiesActions } from "../actions/activities.actions";
import { selectActivities } from "../selectors/activities.selectors";
import { ActivitiesEffects } from "./activities.effects";

describe('Activities Effects', () => {
  let store: MockStore;
  let actions$: Actions;
  let http: HttpClient;
  let effects: ActivitiesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivitiesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        MockProvider(HttpClient),
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    http = TestBed.inject(HttpClient);
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(ActivitiesEffects)
  });

  it('should get activities for date without previous state', async () => {
    store.overrideSelector(selectActivities, []);
    actions$ = of(activitiesActions.get(false, { date: '2022-01-01' }));
    spyOn(http, 'get').and.returnValue(of([]))
    const result = await effects.getActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.success([{ date: '2022-01-01', activities: [] }]));
  });

  it('should not get activities for date with previous state to prevent excess calls', async () => {
    store.overrideSelector(selectActivities, [{ date: '2022-01-01', activities: [{ calories: 123 } as Activity] }])
    actions$ = of(activitiesActions.get(false, { date: '2022-01-01' }));
    spyOn(http, 'get').and.returnValue(of([{ calories: 234 } as Activity]))
    const result = await effects.getActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.success([{ date: '2022-01-01', activities: [{ calories: 123 }] }]));
  });

  it('should get activities for date with previous state and force', async () => {
    store.overrideSelector(selectActivities, [{ date: '2022-01-01', activities: [{ calories: 123 } as Activity] }])
    actions$ = of(activitiesActions.get(true, { date: '2022-01-01' }));
    spyOn(http, 'get').and.returnValue(of([{ calories: 234 } as Activity]))
    const result = await effects.getActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.success([{ date: '2022-01-01', activities: [{ calories: 234 }] }]));
  });

  it('should get activities for date with previous state and sync with strava', async () => {
    store.overrideSelector(selectActivities, [{ date: '2022-01-01', activities: [{ calories: 123 } as Activity] }])
    actions$ = of(activitiesActions.get(true, { date: '2022-01-01', sync: true }));
    spyOn(http, 'get').and.returnValue(of([{ calories: 234 } as Activity]))
    const result = await effects.getActivitiesForDate$.toPromise();
    expect(http.get).toHaveBeenCalledWith('//localhost:8090/activities/day/2022-01-01?forceSync=true');
  });

  it('should handle error on getting activities', async () => {
    actions$ = of(activitiesActions.get(true, { date: '2022-01-01' }));
    spyOn(http, 'get').and.returnValue(throwError({ status: 400 }))
    const result = await effects.getActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.failed({ response: { status: 400 } }));
  });

  it('should post activities for date without previous state', async () => {
    store.overrideSelector(selectActivities, []);
    actions$ = of(activitiesActions.post([{ calories: 123 }], '2022-01-01'));
    spyOn(http, 'post').and.returnValue(of([{ calories: 123 }]))
    const result = await effects.postActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.success([{ date: '2022-01-01', activities: [{ calories: 123 }] }]));
  });

  it('should post activities for date with previous state', async () => {
    store.overrideSelector(selectActivities, [{ date: '2022-01-01', activities: [] }]);
    actions$ = of(activitiesActions.post([{ calories: 123 }], '2022-01-01'));
    spyOn(http, 'post').and.returnValue(of([{ calories: 123 }]))
    const result = await effects.postActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.success([{ date: '2022-01-01', activities: [{ calories: 123 }] }]));
  });

  it('should handle error on posting activities', async () => {
    actions$ = of(activitiesActions.post([], '2022-01-01'));
    spyOn(http, 'post').and.returnValue(throwError({ status: 400 }))
    const result = await effects.postActivitiesForDate$.toPromise();
    expect(result).toEqual(activitiesActions.failed({ response: { status: 400 } }));
  });

});