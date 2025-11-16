import { ActionReducerMap } from '@ngrx/store';
import { Dish } from '../../model/dish';
import { Food } from '../../model/food';
import { AsyncState } from './async.reducers';
import { dishesFeatureKey, dishesReducer } from './dishes.reducers';
import { foodFeatureKey, foodReducer } from './food.reducers';

export interface State {
  [foodFeatureKey]: AsyncState<Food[]>,
  [dishesFeatureKey]: AsyncState<Dish[]>,
}

export const reducers: ActionReducerMap<State> = {
  [foodFeatureKey]: foodReducer,
  [dishesFeatureKey]: dishesReducer,
};
