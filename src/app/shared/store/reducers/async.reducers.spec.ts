import { Action, ActionReducer } from "@ngrx/store";
import { AsyncActions, createAsyncActions } from "../actions/async.actions"
import { AsyncState, createAsyncReducers } from "./async.reducers"

describe('Async Reducers', () => {

  let reducers: ActionReducer<AsyncState<any>, Action>;
  let actions: AsyncActions<any>;
  beforeEach(() => {
    actions = createAsyncActions<any>('TestActions');
    reducers = createAsyncReducers(undefined, actions);
  })

  it('should reduce get action', () => {
    const result = reducers(undefined, actions.get(false, { id: 1 }));
    expect(result).toEqual({
      params: { id: 1 },
      loading: true,
    });
  });

  it('should reduce post action', () => {
    const result = reducers(undefined, actions.post({ id: 1 }));
    expect(result).toEqual({
      loading: true,
    });
  });

  it('should reduce success action', () => {
    const result = reducers(undefined, actions.success({ id: 1 }));
    expect(result).toEqual({
      data: { id: 1 },
      error: undefined,
      loading: false,
    });
  });

  it('should reduce failed action', () => {
    const result = reducers(undefined, actions.failed({ id: 1 }));
    expect(result).toEqual({
      data: undefined,
      error: { id: 1 },
      loading: false,
    });
  });


});
