import { ActionReducerMap } from '@ngrx/store';
import { Activity } from '../../model/activity';
import { Entry } from '../../model/entry';
import { Food } from '../../model/food';
import { activitiesFeatureKey, activitiesReducer } from './activities.reducers';
import { AsyncState } from './async.reducers';
import { entriesFeatureKey, entriesReducer } from './entries.reducers';
import { foodFeatureKey, foodReducer } from './food.reducers';

export interface State {
  [foodFeatureKey]: AsyncState<Food[]>
  [entriesFeatureKey]: AsyncState<{date: string, entries: Entry[]}[]>
  [activitiesFeatureKey]: AsyncState<{date: string, activities: Activity[]}[]>
}

export const reducers: ActionReducerMap<State> = {
  [foodFeatureKey]: foodReducer,
  [entriesFeatureKey]: entriesReducer,
  [activitiesFeatureKey]: activitiesReducer,
};
