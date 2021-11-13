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
      concatMap((action) => {
        return this.http.get<Food[]>(this.backendUrl).pipe(
          map(response => {
            console.log(response)
            return foodActions.success(response);
          }),
          catchError(err => {
            return of(foodActions.failed({ response: err }));
          })
        );
      })
    )
  })

  constructor(private readonly actions$: Actions,
    private readonly http: HttpClient) {

  }
}