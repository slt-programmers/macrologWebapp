import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Mealplan } from "../model/mealplan";

interface PlanState {
  plans: Mealplan[];
}

const initialState: PlanState = {
  plans: []
}

export const PlanStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    getPlan(id: number) {
      const plan = store.plans().filter(plan => plan.id === id)[0]
      return plan;
    },
    createPlan() {
      patchState(store, { plans: [...store.plans(), { id: 0, title: 'New mealplan', mealtimes: [] }] })
    }
  }))
)