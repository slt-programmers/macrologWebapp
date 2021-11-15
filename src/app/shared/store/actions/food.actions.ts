import { createAsyncActions } from "./async.actions";

export const foodActions = { 
  ...createAsyncActions('Food')
}