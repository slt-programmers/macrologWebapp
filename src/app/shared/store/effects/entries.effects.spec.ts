import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MockProvider } from "ng-mocks";
import { of, throwError } from "rxjs";
import { Entry } from "../../model/entry";
import { entriesActions } from "../actions/entries.actions";
import { selectEntries } from "../selectors/entries.selectors";
import { EntriesEffects } from "./entries.effects";

describe('Entries Effects', () => {
  let store: MockStore;
  let actions$: Actions;
  let http: HttpClient;
  let effects: EntriesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntriesEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        MockProvider(HttpClient),
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    http = TestBed.inject(HttpClient);
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(EntriesEffects)
  });

  it('should get entries for date without previous state', async () => {
    store.overrideSelector(selectEntries, []);
    actions$ = of(entriesActions.get(false, '2022-01-01'));
    spyOn(http, 'get').and.returnValue(of([]))
    const result = await effects.getEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.success([{ date: '2022-01-01', entries: [] }]));
  });

  it('should not get entries for date with previous state to prevent excess calls', async () => {
    store.overrideSelector(selectEntries, [{ date: '2022-01-01', entries: [] }])
    actions$ = of(entriesActions.get(false, '2022-01-01'));
    spyOn(http, 'get').and.returnValue(of([{ food: {} } as Entry]))
    const result = await effects.getEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.success([{ date: '2022-01-01', entries: [] }]));
  });

  it('should get entries for date with previous state and force', async () => {
    store.overrideSelector(selectEntries, [{ date: '2022-01-01', entries: [{ food: {} } as Entry] }])
    actions$ = of(entriesActions.get(true, '2022-01-01'));
    spyOn(http, 'get').and.returnValue(of([{ food: {} } as Entry, { food: {} } as Entry]))
    const result = await effects.getEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.success([{ date: '2022-01-01', entries: [{ food: {} }, { food: {} }] }]));
  });

  it('should handle error on getting entries', async () => {
    actions$ = of(entriesActions.get(true, '2022-01-01'));
    spyOn(http, 'get').and.returnValue(throwError({ status: 400 }))
    const result = await effects.getEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.failed({ response: { status: 400 } }));
  });

  it('should post entries for date without previous state', async () => {
    store.overrideSelector(selectEntries, []);
    actions$ = of(entriesActions.post([{ food: {} }], { date: '2022-01-01', meal: 'BREAKFAST' }));
    spyOn(http, 'post').and.returnValue(of([{ food: {} }]))
    const result = await effects.postEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.success([{ date: '2022-01-01', entries: [{ food: {} }] }]));
  });

  it('should post entries for date with previous state', async () => {
    store.overrideSelector(selectEntries, [{ date: '2022-01-01', entries: [] }]);
    actions$ = of(entriesActions.post([{ food: {} }], { date: '2022-01-01', meal: 'BREAKFAST' }));
    spyOn(http, 'post').and.returnValue(of([{ food: {} }]))
    const result = await effects.postEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.success([{ date: '2022-01-01', entries: [{ food: {} }] }]));
  });

  it('should handle error on posting entries', async () => {
    actions$ = of(entriesActions.post([], { date: '2022-01-01', meal: 'BREAKFAST' }));
    spyOn(http, 'post').and.returnValue(throwError({ status: 400 }))
    const result = await effects.postEntriesForDate$.toPromise();
    expect(result).toEqual(entriesActions.failed({ response: { status: 400 } }));
  });

});
