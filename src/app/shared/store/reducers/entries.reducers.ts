import { Entry } from "../../model/entry";
import { entriesActions } from "../actions/entries.actions";
import { AsyncState, createAsyncReducers } from "./async.reducers";

export const entriesFeatureKey = 'entries';

const initialState: AsyncState<{date: string, entries: Entry[]}[]> = {
  data: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
  params: undefined
};

export const entriesReducer = createAsyncReducers<{date: string, entries: Entry[]}[]>(initialState, entriesActions);
