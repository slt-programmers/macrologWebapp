import { ActionReducerMap } from '@ngrx/store';
import { Dish } from '../../model/dish';
import { Food } from '../../model/food';
import { AsyncState } from './async.reducers';
import { foodFeatureKey, foodReducer } from './food.reducers';

export interface State {
  [foodFeatureKey]: AsyncState<Food[]>,
}

export const reducers: ActionReducerMap<State> = {
  [foodFeatureKey]: foodReducer,
};
