import { Activity } from "../../model/activity";
import { activitiesActions } from "../actions/activities.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const activitiesFeatureKey = 'activities';

export interface ActivitiesState {
  date: string,
  activities: Activity[],
}

const initialState: AsyncState<ActivitiesState[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const activitiesReducer =
  createAsyncReducers<ActivitiesState[]>(initialState, activitiesActions);
