import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Food } from "../../model/food";
import { AsyncState } from "../reducers/async.reducers";
import { foodFeatureKey } from "../reducers/food.reducers";

export const selectFoodState = createFeatureSelector<AsyncState<Food[]>>(foodFeatureKey);

export const selectAllFood = createSelector(selectFoodState, (state) => {
  if (state && state.data) {
    return state.data;
  }
  return [];
});

export const selectFoodLoading  = createSelector(selectFoodState, (state) => {
  return state.loading;
});
