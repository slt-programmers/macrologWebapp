import { createAsyncActions } from "./async.actions"

describe('Async Actions', () => {

  it('should create async actions', () => {
    const result = createAsyncActions<any>('TestActions');
    expect(result.get.type).toEqual('[TestActions] Get');
    expect(result.post.type).toEqual('[TestActions] Post');
    expect(result.success.type).toEqual('[TestActions] Success');
    expect(result.failed.type).toEqual('[TestActions] Failed');
  });

  it('should call get action', () => {
    const actions = createAsyncActions<any>('TestActions');
    expect(actions.get.type).toEqual('[TestActions] Get');
    const result = actions.get({id: 1});
    expect(result).toEqual({params: {id: 1}, type: '[TestActions] Get'});
  });

  it('should call post action', () => {
    const actions = createAsyncActions<any>('TestActions');
    expect(actions.post.type).toEqual('[TestActions] Post');
    const result = actions.post({ id: 1 });
    expect(result).toEqual({body: {id: 1}, type: '[TestActions] Post'});
  });
  
  it('should call success action', () => {
    const actions = createAsyncActions<any>('TestActions');
    expect(actions.success.type).toEqual('[TestActions] Success');
    const result = actions.success({ id: 1 });
    expect(result).toEqual({response: {id: 1}, type: '[TestActions] Success'});
  });

  it('should call failed action', () => {
    const actions = createAsyncActions<any>('TestActions');
    expect(actions.failed.type).toEqual('[TestActions] Failed');
    const result = actions.failed({ id: 1 });
    expect(result).toEqual({response: {id: 1}, type: '[TestActions] Failed'});
  });

});
