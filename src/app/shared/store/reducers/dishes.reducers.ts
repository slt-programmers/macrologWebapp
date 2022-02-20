import { Dish } from "../../model/dish";
import { dishesActions } from "../actions/dishes.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const dishesFeatureKey = 'dishes';

const initialState: AsyncState<Dish[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const dishesReducer = createAsyncReducers<Dish[]>(initialState, dishesActions);
