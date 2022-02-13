import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, concatMap, map, withLatestFrom } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Activity } from "../../model/activity";
import { activitiesActions } from "../actions/activities.actions";
import { selectActivities } from "../selectors/activities.selectors";

@Injectable()
export class ActivitiesEffects {

  private backendUrl = '//' + environment.backend + '/activities';

  getActivitiesForDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(activitiesActions.get),
      withLatestFrom(this.store.select(selectActivities)),
      concatMap(([action, state]) => {        
        const hasActivitiesForDate = state?.filter(apd => apd.date === action.params.date)[0];
        if (!state || !hasActivitiesForDate || action.force) {
          const syncUrl = action.params.sync ? '?forceSync=true' : ''
          return this.http.get<Activity[]>(this.backendUrl + '/day/' + action.params.date + syncUrl).pipe(
            map(response => {
              state.push({ date: action.params.date, activities: response });
              return activitiesActions.success(state);
            }),
            catchError(error => {
              return of(activitiesActions.failed({ response: error }));
            })
          );
        }
        return of(activitiesActions.success(state));
      })      
    );
  });

  postActivitiesForDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(activitiesActions.post),
      withLatestFrom(this.store.select(selectActivities)),
      concatMap(([action, state]) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.post<Activity[]>(this.backendUrl + '/day/' + action.params, action.body, options).pipe(
          map(response => {
            const dateInState = state.filter(epd => epd.date === action.params)[0]
            !dateInState ? state.push({ date: action.date, activities: response }) : dateInState.activities = response;
            return activitiesActions.success(state)
          }),
          catchError(
            error => of(activitiesActions.failed({ response: error }))
          ));
      })
    )
  });

  constructor(private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly store: Store) {}
}