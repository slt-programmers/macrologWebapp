import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
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
      concatLatestFrom(() => this.store.select(selectActivities)),
      concatMap(([action, state]) => {        
        const hasActivitiesForDate = state.filter(apd => apd.date === action.params.date)[0];
        if (!state || !hasActivitiesForDate || action.force) {
          const syncUrl = action.params.sync ? '?forceSync=true' : ''
          return this.http.get<Activity[]>(this.backendUrl + '/day/' + action.params.date + syncUrl).pipe(
            map(response => {
              const dateInState = state.filter(epd => epd.date === action.params.date)[0]
              if (!dateInState) {
                state.push({date: action.params.date, activities: response})
              } else {
                dateInState.activities = response;
              }
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
      concatLatestFrom(() => this.store.select(selectActivities)),
      concatMap(([action, state]) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.post<Activity[]>(this.backendUrl + '/day/' + action.params, action.body, options).pipe(
          map(response => {
            const dateInState = state.filter(epd => epd.date === action.params)[0]
            if (!dateInState) {
              state.push({date: action.params, activities: response})
            } else {
              dateInState.activities = response;
            }
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