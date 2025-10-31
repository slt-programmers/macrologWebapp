import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { map, catchError, concatMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Food } from "../../model/food";
import { foodActions } from "../actions/food.actions";


@Injectable()
export class FoodEffects {

  private backendUrl = '//' + environment.backend + '/food'

  getAllFood$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(foodActions.get),
      concatMap(() => {
        return this.http.get<Food[]>(this.backendUrl).pipe(
          map(response => {
            return foodActions.success(response);
          }),
          catchError(error => {
            return of(foodActions.failed({ response: error }));
          })
        );
      })
    )
  });

  postFood$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(foodActions.post),
      concatMap((action) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.post<Food>(this.backendUrl + '/', action.body, options).pipe(
          map(() => {
            return foodActions.get();
          }),
          catchError(error => {
            return of(foodActions.failed({ response: error }));
          }));
      })
    );
  })

  constructor(private readonly actions$: Actions, private readonly http: HttpClient) { }

}
