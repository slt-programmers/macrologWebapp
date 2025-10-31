import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { concatLatestFrom} from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { concatMap, catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Entry } from "../../model/entry";
import { entriesActions } from "../actions/entries.actions";
import { selectEntries } from "../selectors/entries.selectors";
import { EntriesState } from "../reducers/entries.reducers";


@Injectable()
export class EntriesEffects {

  private backendUrl = '//' + environment.backend + '/logs'

  getEntriesForDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(entriesActions.get),
      concatLatestFrom(() => this.store.select(selectEntries)),
      concatMap(([action, state]) => {
        const hasEntriesForDate = state.filter((epd: EntriesState) => epd.date === action.params)[0];
        if (!state || !hasEntriesForDate || action.force) {
          return this.http.get<Entry[]>(this.backendUrl + '/day/' + action.params).pipe(
            map(response => {
              if (!hasEntriesForDate) {
                state.push({ date: action.params, entries: response })
              }
              else {
                hasEntriesForDate.entries = response;
              }
              return entriesActions.success(state);
            }),
            catchError(error => {
              return of(entriesActions.failed({ response: error }));
            })
          );
        }
        return of(entriesActions.success(state));
      })
    )
  });

  postEntriesForDate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(entriesActions.post),
      concatLatestFrom(() => this.store.select(selectEntries)),
      concatMap(([action, state]) => {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        };
        const options = { headers: headers };
        return this.http.post<Entry[]>(this.backendUrl + '/day/' + action.params.date + '/' + action.params.meal, action.body, options).pipe(
          map(response => {
            const dateInState = state.filter((epd: EntriesState) => epd.date === action.params.date)[0]
            if (!dateInState) {
              state.push({ date: action.params.date, entries: response })
            }
            else {
              dateInState.entries = response;
            }
            return entriesActions.success(state)
          }),
          catchError(
            error => of(entriesActions.failed({ response: error }))
          ));
      })
    )
  });

  constructor(private readonly actions$: Actions, private readonly http: HttpClient,
    private readonly store: Store) {

  }

}

