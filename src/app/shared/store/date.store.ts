import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { formatDate } from "@angular/common";

const initialState = {
  displayDate: formatDate(new Date(), "yyyy-MM-dd", "en-US"),
}

export const DateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setDisplayDate(displayDate: string) {
      patchState(store, { displayDate });
    }
  }))
)