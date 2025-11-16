import { patchState, signalStore, withMethods, withProps, withState } from "@ngrx/signals";
import { Activity } from "../model/activity";
import { inject } from "@angular/core";
import { ActivityService } from "../services/activity.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { tapResponse } from "@ngrx/operators";

export interface ActivitiesPerDay {
  date: string;
  activities: Activity[];
}

interface ActivityState {
  activitiesPerDay: ActivitiesPerDay[];
}
const initialState: ActivityState = {
  activitiesPerDay: []
}

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    activitesService: inject(ActivityService)
  })),
  withMethods(() => ({
    _filterDay(activitiesPerDay: ActivitiesPerDay[], date: string): ActivitiesPerDay {
      return activitiesPerDay.filter((apd) => apd.date === date)[0];
    },
    filterDay(activitiesPerDay: ActivitiesPerDay[], date: string): Activity[] {
      return activitiesPerDay.filter((apd) => apd.date === date)[0]?.activities || [];
    },
  })),
  withMethods((store) => ({
    getActivitiesForDay: rxMethod<{ date: string, force: boolean }>(pipe(
      concatMap((request) => {
        return store.activitesService.getActivitiesForDay(request.date, request.force).pipe(tapResponse({
          next: (response) => {
            const allActivitiesPerDay = store.activitiesPerDay();
            console.log(allActivitiesPerDay)
            const activitiesOnDay = store._filterDay(allActivitiesPerDay, request.date);
            console.log(activitiesOnDay)
            if (activitiesOnDay) {
              activitiesOnDay.activities = response;
            } else {
              allActivitiesPerDay.push({ date: request.date, activities: response });
            }
            console.log(allActivitiesPerDay)
            patchState(store, { activitiesPerDay: [...allActivitiesPerDay] });
          },
          error: () => {
            // TODO
          }
        }))
      })
    )),
    postActivitiesForDay: rxMethod<{ date: string, activities: Activity[] }>(pipe(
      concatMap(request => {
        return store.activitesService.postActivitiesForDay(request.date, request.activities).pipe(tapResponse({
          next: (response: Activity[]) => {
            const allActivitiesPerDay = store.activitiesPerDay();
            const activitiesOnDay = store._filterDay(
              allActivitiesPerDay,
              request.date
            );
            if (activitiesOnDay) {
              activitiesOnDay.activities = response;
            } else {
              allActivitiesPerDay.push({ date: request.date, activities: response })
            }
            patchState(store, { activitiesPerDay: [...allActivitiesPerDay] });
          },
          error: () => { 
            // TODO
          }
        }))
      })
    ))
  }))
)