import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Activity } from "../../model/activity";
import { activitiesFeatureKey } from "../reducers/activities.reducers";
import { AsyncState } from "../reducers/async.reducers";

export const selectActivitiesState = createFeatureSelector<AsyncState<{ date: string, activities: Activity[] }[]>>(activitiesFeatureKey);

export const selectActivitiesLoading = createSelector(selectActivitiesState, (state) => {
  if (state) {
    return state.loading;
  }
  return false;
});

export const selectActivities = createSelector(selectActivitiesState, (state) => {
  if (state && state.data) {
    return state.data;
  }
  return [];
});

export const selectActivitiesDate = (date: string) => createSelector(selectActivitiesState, (state) => {
  console.log('here');
  console.log(state)
  if (state && state.data) {
    const array = state.data.filter(apd => apd.date === date)
    return array[0]?.activities;
  }
  return undefined;
});