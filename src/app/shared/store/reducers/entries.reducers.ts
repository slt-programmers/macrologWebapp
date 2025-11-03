import { Entry } from "../../model/entry";
import { entriesActions } from "../actions/entries.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const entriesFeatureKey = 'entries';

export interface EntriesState {
  date: string,
  entries: Entry[]
}

const initialState: AsyncState<EntriesState[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const entriesReducer = createAsyncReducers<EntriesState[]>(initialState, entriesActions);
