import { createReducer, on } from "@ngrx/store";
import { AsyncActions } from "../actions/async.actions";

export interface AsyncState<T> {
  data: T | undefined,
  loading: boolean,
  error: any | undefined,
  pagination?: any | undefined,
  parameters?: any | undefined
}

export const createAsyncReducers = <T>(initialState: AsyncState<T>, actions: AsyncActions<T>) => {
  return createReducer(
    initialState,
    on(actions.get, (state): AsyncState<T> => {
      return {
        ...state,
        loading: true
      }
    }),
    on(actions.post, (state): AsyncState<T> => {
      return {
        ...state,
        loading: true
      }
    }),
    on(actions.success, (state, { response }): AsyncState<T> => {
      return {
        data: response,
        loading: false,
        error: undefined
      }
    }),
    on(actions.failed, (state, { response }): AsyncState<T> => {
      return {
        loading: false,
        data: undefined,
        error: response
      }
    })
  )
}