import { createAction } from "@ngrx/store"
import { FunctionWithParametersType, TypedAction } from "@ngrx/store/src/models"

export interface AsyncActions<T> {
  get: FunctionWithParametersType<[params?: T], any> & TypedAction<string>,
  post: FunctionWithParametersType<[body: T], any> & TypedAction<string>,
  success: FunctionWithParametersType<[response: any], any> & TypedAction<string>,
  failed: FunctionWithParametersType<[response: any], any> & TypedAction<string>,
}

export const createAsyncActions = <T>(featureKey: string): AsyncActions<T> => {
  return {
    get: createAction(`[${featureKey}] Get`, (params?: T) => ({ params })),
    post: createAction(`[${featureKey}] Post`, (body: T) => ({ body })),
    success: createAction(`[${featureKey}] Success`, (response: any) => ({ response })),
    failed: createAction(`[${featureKey}] Failed`, (response: any) => ({ response }))
  }
}