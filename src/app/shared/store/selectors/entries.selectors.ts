import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Entry } from "../../model/entry";
import { Macros } from "../../model/macros";
import { AsyncState } from "../reducers/async.reducers";
import { entriesFeatureKey } from "../reducers/entries.reducers";

export const selectEntriesState = createFeatureSelector<AsyncState<{date: string, entries: Entry[]}[]>>(entriesFeatureKey);

export const selectEntries = createSelector(selectEntriesState, (state) => {
  if (state && state.data) {
    return state.data;
  }
  return [];
});

export const selectEntriesDate = (date: string) => createSelector(selectEntriesState, (state) => {
  if (state && state.data) {
    const array = state.data.filter(epd => epd.date === date)
    return array[0]?.entries
  }
  return undefined;
});

export const selectEntriesDateMeal = (date: string, meal: string) => createSelector(selectEntriesState, (state) => {
  if (state && state.data) {
    const entriesForDate = state.data.filter(epd => epd.date === date)[0];
    if (!!entriesForDate) {
      return entriesForDate.entries.filter(entry => entry.meal === meal.toUpperCase());
    }
  }
  return undefined;
});

export const selectTotalsForDate = (date: string) => createSelector(selectEntriesDate(date), (entries) => {
  const totalMacros: Macros = {
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0
  }
  if (entries) {
    for (const entry of entries) {
      totalMacros.protein += entry.macrosCalculated.protein;
      totalMacros.fat += entry.macrosCalculated.fat;
      totalMacros.carbs += entry.macrosCalculated.carbs;
      totalMacros.calories += entry.macrosCalculated.calories
    }
  }
  return totalMacros;
});
