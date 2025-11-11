import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Actions } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { MockProvider } from "ng-mocks";
import { of, throwError } from "rxjs";
import { foodActions } from "../actions/food.actions";
import { FoodEffects } from "./food.effects";

describe('Food Effects', () => {
  let actions$: Actions;
  let http: HttpClient;
  let effects: FoodEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FoodEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        MockProvider(HttpClient),
      ]
    }).compileComponents();

    http = TestBed.inject(HttpClient);
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(FoodEffects)
  });

  it('should get all food', async () => {
    actions$ = of(foodActions.get);
    spyOn(http, 'get').and.returnValue(of([]))
    const result = await effects.getAllFood$.toPromise();
    expect(result).toEqual(foodActions.success([]));
  });

  it('should handle error on get all food', async () => {
    actions$ = of(foodActions.get);
    spyOn(http, 'get').and.returnValue(throwError({ status: 404 }))
    const result = await effects.getAllFood$.toPromise();
    expect(result).toEqual(foodActions.failed({ response: { status: 404 } }));
  });

  it('should post food', async () => {
    actions$ = of(foodActions.post);
    spyOn(http, 'post').and.returnValue(of({}))
    const result = await effects.postFood$.toPromise();
    expect(result).toEqual(foodActions.get());
  });
  it('should handle error on post food', async () => {
    actions$ = of(foodActions.post);
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }))
    const result = await effects.postFood$.toPromise();
    expect(result).toEqual(foodActions.failed({ response: { status: 404 } }));
  });

});