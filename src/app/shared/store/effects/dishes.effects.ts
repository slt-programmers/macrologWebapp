import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { concatMap, catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Dish } from "../../model/dish";
import { dishesActions } from "../actions/dishes.actions";

@Injectable()
export class DishesEffects {

  private backendUrl = '//' + environment.backend + '/dishes'

  getAllDishes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dishesActions.get),
      concatMap(() => {
        return this.http.get<Dish[]>(this.backendUrl).pipe(
          map(response => {
            return dishesActions.success(response);
          }),
          catchError(error => {
            return of(dishesActions.failed({ response: error }));
          })
        );
      })
    )
  });

  postDish$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dishesActions.post),
      concatMap((action) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.post<Dish>(this.backendUrl, action.body, options).pipe(
          map((response) => {
            this.store.dispatch(dishesActions.get());
            return dishesActions.success(response);
          }),
          catchError(error => {
            return of(dishesActions.failed({response: error}));
          }));
      })
    );
  });

  deleteDish$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(dishesActions.delete),
      concatMap((action) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.delete<number>(this.backendUrl + '/' + action.params, options).pipe(
          map(response => {
            this.store.dispatch(dishesActions.get());
            return dishesActions.success(response);
          }),
          catchError(error => {
            return of(dishesActions.failed({response: error}));
          })
        )
      })
    )
  })

  constructor(private readonly actions$: Actions, private readonly http: HttpClient,
    private readonly store: Store) { }
}