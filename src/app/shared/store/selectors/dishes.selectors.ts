import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Dish } from "../../model/dish";
import { AsyncState } from "../reducers/async.reducers";
import { dishesFeatureKey } from "../reducers/dishes.reducers";

export const selectDishesState = createFeatureSelector<AsyncState<Dish[]>>(dishesFeatureKey);

export const selectAllDishes = createSelector(selectDishesState, (state) => {
  if (state && state.data) {
    return state.data;
  }
  return [];
});

export const selectFoodLoading = createSelector(selectDishesState, (state) => {
  return state.loading;
});
