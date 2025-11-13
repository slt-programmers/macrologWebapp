import { ActionReducerMap } from '@ngrx/store';
import { Activity } from '../../model/activity';
import { Dish } from '../../model/dish';
import { Food } from '../../model/food';
import { activitiesFeatureKey, activitiesReducer } from './activities.reducers';
import { AsyncState } from './async.reducers';
import { dishesFeatureKey, dishesReducer } from './dishes.reducers';
import { foodFeatureKey, foodReducer } from './food.reducers';

export interface State {
  [foodFeatureKey]: AsyncState<Food[]>,
  [dishesFeatureKey]: AsyncState<Dish[]>,
  [activitiesFeatureKey]: AsyncState<{date: string, activities: Activity[]}[]>,
}

export const reducers: ActionReducerMap<State> = {
  [foodFeatureKey]: foodReducer,
  [dishesFeatureKey]: dishesReducer,
  [activitiesFeatureKey]: activitiesReducer,
};
