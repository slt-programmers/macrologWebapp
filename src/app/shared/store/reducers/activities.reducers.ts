import { Activity } from "../../model/activity";
import { activitiesActions } from "../actions/activities.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const activitiesFeatureKey = 'activities';

const initialState: AsyncState<{ date: string, activities: Activity[]}[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const activitiesReducer =
  createAsyncReducers<{ date: string, activities: Activity[]}[]>(initialState, activitiesActions);
