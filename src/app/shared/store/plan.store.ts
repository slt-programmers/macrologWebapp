import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { tapResponse } from "@ngrx/operators";
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { Mealplan } from "../model/mealplan";
import { Mealtime } from "../model/mealtime";
import { PlanService } from "../services/plan.service";

interface PlanState {
  mealtimeToEdit?: Mealtime;
  plans: Mealplan[];
}

const initialState: PlanState = {
  mealtimeToEdit: undefined,
  plans: [],
};

export const PlanStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withProps(() => ({
    planService: inject(PlanService),
    router: inject(Router),
  })),
  withMethods((store) => ({
    getPlan(id: number) {
      const plan = store.plans().filter((plan) => plan.id === id)[0];
      return plan;
    },
  })),
  withMethods((store) => ({
    setMealtimeToEdit(mealtimeToEdit: Mealtime | undefined) {
      patchState(store, { mealtimeToEdit });
    },
    getPlans: rxMethod<void>(pipe(
      concatMap(() => {
        return store.planService.getPlans().pipe(tapResponse({
          next: (plans: Mealplan[]) => {
            patchState(store, { plans })
          },
          error: () => { 
            // TODO
          }
        }))
      })
    )),
    createPlan: rxMethod<void>(
      pipe(
        concatMap(() => {
          return store.planService.createPlan().pipe(
            tapResponse({
              next: (mealplan: Mealplan) => {
                console.log(mealplan)
                patchState(store, {
                  plans: [...store.plans(), mealplan],
                });
                store.router.navigate(["dashboard", "plans", mealplan.id]);
              },
              error: () => {
                // TODO
              },
            })
          );
        })
      )
    ),
    saveMealplanTitle: rxMethod<number>(
      pipe(concatMap((planId) => {
        const plan = store.getPlan(planId);
        return store.planService.savePlan(plan).pipe(
            tapResponse({
              next: (mealplan: Mealplan) => {
                const plans = store.plans().filter(p => p.id !== mealplan.id);
                patchState(store, {
                  plans: [...plans, mealplan],
                });
              },
              error: () => {
                // TODO
              },
            })
          )
      }))
    ),
    saveMealtime: rxMethod<{ planId: number; mealtime: Mealtime }>(
      pipe(
        concatMap(({ planId, mealtime }) => {
          const plan = store.getPlan(planId);
          plan.mealtimes = plan.mealtimes.filter(
            (m) =>
              !(m.weekday === mealtime.weekday &&
                m.meal === mealtime.meal)
          );
          plan.mealtimes.push(mealtime);
          return store.planService.savePlan(plan).pipe(
            tapResponse({
              next: (mealplan: Mealplan) => {
                const plans = store.plans().filter(p => p.id !== mealplan.id);
                patchState(store, {
                  plans: [...plans, mealplan],
                });
                store.router.navigate(["dashboard", "plans", mealplan.id]);
              },
              error: () => {
                // TODO
              },
            })
          );
        })
      )
    ),
    deletePlan: rxMethod<number>(pipe(
      concatMap(id => {
        return store.planService.deletePlan(id).pipe(tapResponse({
          next: () => {
            const plans = store.plans().filter(p => p.id !== id);
            patchState(store, { plans: [...plans] })
          },
          error: () => {
            // TODO
          }
        }))
      })
    ))
  })),
  withHooks({
    onInit(store) {
      store.getPlans();
    }
  })
);
