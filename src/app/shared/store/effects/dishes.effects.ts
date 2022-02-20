import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
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
      concatMap((action) => {
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

  constructor(private readonly actions$: Actions, private readonly http: HttpClient) {}
}