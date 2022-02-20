import { ActionReducerMap } from '@ngrx/store';
import { Activity } from '../../model/activity';
import { Dish } from '../../model/dish';
import { Entry } from '../../model/entry';
import { Food } from '../../model/food';
import { activitiesFeatureKey, activitiesReducer } from './activities.reducers';
import { AsyncState } from './async.reducers';
import { dishesFeatureKey, dishesReducer } from './dishes.reducers';
import { entriesFeatureKey, entriesReducer } from './entries.reducers';
import { foodFeatureKey, foodReducer } from './food.reducers';

export interface State {
  [foodFeatureKey]: AsyncState<Food[]>,
  [dishesFeatureKey]: AsyncState<Dish[]>,
  [entriesFeatureKey]: AsyncState<{date: string, entries: Entry[]}[]>,
  [activitiesFeatureKey]: AsyncState<{date: string, activities: Activity[]}[]>,
}

export const reducers: ActionReducerMap<State> = {
  [foodFeatureKey]: foodReducer,
  [dishesFeatureKey]: dishesReducer,
  [entriesFeatureKey]: entriesReducer,
  [activitiesFeatureKey]: activitiesReducer,
};
