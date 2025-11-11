import { Action, createAction, FunctionWithParametersType } from "@ngrx/store"

export interface AsyncActions<T> {
  get: FunctionWithParametersType<[force?: boolean, params?: any], any> & Action<`[${string}] Get`>,
  post: FunctionWithParametersType<[body: T, params?: any], any> & Action<`[${string}] Post`>,
  delete: FunctionWithParametersType<[params?: any], any> & Action<`[${string}] Delete`>,
  success: FunctionWithParametersType<[response: any], any> & Action<`[${string}] Success`>,
  failed: FunctionWithParametersType<[response: any], any> & Action<`[${string}] Failed`>,
}

export const createAsyncActions = <T>(featureKey: string): AsyncActions<T> => {
  return {
    get: createAction(`[${featureKey}] Get`, (force?: boolean, params?: any) => ({ force, params })),
    post: createAction(`[${featureKey}] Post`, (body: T, params?: any) => ({ body, params })),
    delete: createAction(`[${featureKey}] Delete`, (params?: any) => ({ params })),
    success: createAction(`[${featureKey}] Success`, (response: any) => ({ response })),
    failed: createAction(`[${featureKey}] Failed`, (response: any) => ({ response }))
  }
}