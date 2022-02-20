import { createAction } from "@ngrx/store"
import { FunctionWithParametersType, TypedAction } from "@ngrx/store/src/models"

export interface AsyncActions<T> {
  get: FunctionWithParametersType<[force?: boolean, params?: any], any> & TypedAction<string>,
  post: FunctionWithParametersType<[body: T, params?: any], any> & TypedAction<string>,
  delete: FunctionWithParametersType<[params?: any], any> & TypedAction<string>,
  success: FunctionWithParametersType<[response: any], any> & TypedAction<string>,
  failed: FunctionWithParametersType<[response: any], any> & TypedAction<string>,
}

export const createAsyncActions = <T>(featureKey: string): AsyncActions<T> => {
  return {
    get: createAction(`[${featureKey}] Get`, (force?: boolean, params?: any) => ({ force, params })),
    post: createAction(`[${featureKey}] Post`, (body: T, params?: any) => ({body, params})),
    delete: createAction(`[${featureKey}] Delete`, (params?: any) => ({params})),
    success: createAction(`[${featureKey}] Success`, (response: any) => ({ response })),
    failed: createAction(`[${featureKey}] Failed`, (response: any) => ({ response }))
  }
}