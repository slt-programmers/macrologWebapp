import { Food } from "../../model/food";
import { foodActions } from "../actions/food.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const foodFeatureKey = 'food';

const initialState: AsyncState<Food[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const foodReducer = createAsyncReducers<Food[]>(initialState, foodActions);
