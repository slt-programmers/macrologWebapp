import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { EntryService } from "../services/entry.service";
import { computed, inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { Entry } from "../model/entry";
import { Macros } from "../model/macros";
import { Meal } from "../model/meal";
import { DateStore } from "./date.store";

export interface EntriesPerDay {
  date: string;
  entries: Entry[];
}

interface EntriesState {
  entriesPerDay: EntriesPerDay[];
}

const initialState: EntriesState = {
  entriesPerDay: [],
};

export const EntryStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withProps(() => ({
    dateStore: inject(DateStore),
    entryService: inject(EntryService),
  })),
  withComputed((store) => ({
    totalsForDay: computed(() => {
      const totals: Macros = {
        protein: 0,
        fat: 0,
        carbs: 0,
        calories: 0,
      };
      const entriesForDay = store
        .entriesPerDay()
        .filter((epd) => epd.date === store.dateStore.displayDate())[0];
      if (entriesForDay) {
        for (const entry of entriesForDay.entries) {
          totals.protein += entry.macrosCalculated.protein;
          totals.fat += entry.macrosCalculated.fat;
          totals.carbs += entry.macrosCalculated.carbs;
          totals.calories += entry.macrosCalculated.calories;
        }
      }
      return totals;
    }),
  })),
  withMethods(() => ({
    _filterDay(entriesPerDay: EntriesPerDay[], date: string): EntriesPerDay {
      return entriesPerDay.filter((epd) => epd.date === date)[0];
    },
    filterDay(entriesPerDay: EntriesPerDay[], date: string): Entry[] {
      return entriesPerDay.filter((epd) => epd.date === date)[0]?.entries || [];
    },
    filterMeal(entries: Entry[], meal: Meal): Entry[] {
      return entries.filter((e) => e.meal === meal);
    },
  })),
  withMethods((store) => ({
    getEntriesForDay: rxMethod<string>(
      pipe(
        concatMap((date: string) => {
          return store.entryService.getEntriesPerDay(date).pipe(
            tapResponse({
              next: (response) => {
                const allEntriesPerDay = store.entriesPerDay();
                const entriesOnDay = store._filterDay(allEntriesPerDay, date);
                if (entriesOnDay) {
                  entriesOnDay.entries = response;
                } else {
                  allEntriesPerDay.push({ date, entries: response });
                }
                patchState(store, { entriesPerDay: [...allEntriesPerDay] });
              },
              error: () => {
                // TODO
              },
            })
          );
        })
      )
    ),
    postEntriesForDayAndMeal: rxMethod<{
      entries: Entry[];
      date: string;
      meal: Meal;
    }>(
      pipe(
        concatMap((request) => {
          return store.entryService
            .postEntriesPerDayPerMeal(
              request.entries,
              request.date,
              request.meal
            )
            .pipe(
              tapResponse({
                next: (response: Entry[]) => {
                  const allEntriesPerDay = store.entriesPerDay();
                  const entriesOnDay = store._filterDay(
                    allEntriesPerDay,
                    request.date
                  );
                  if (entriesOnDay) {
                    entriesOnDay.entries = response;
                  } else {
                    allEntriesPerDay.push({ date: request.date, entries: response })
                  }
                  patchState(store, { entriesPerDay: [...allEntriesPerDay] });
                },
                error: () => {
                  // TODO
                },
              })
            );
        })
      )
    ),
  }))
);
