import { patchState, signalStore, withHooks, withMethods, withProps, withState } from "@ngrx/signals";
import { Food } from "../model/food";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { inject } from "@angular/core";
import { FoodService } from "../services/food.service";
import { tapResponse } from "@ngrx/operators";

interface FoodState {
  loading: boolean;
  food: Food[];
}
const initialState: FoodState = {
  loading: true,
  food: [],
};

export const FoodStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withProps(() => ({
    foodService: inject(FoodService),
  })),
  withMethods((store) => ({
    _getFood() {
      return store.foodService.getFood().pipe(
        tapResponse({
          next: (food: Food[]) => {
            patchState(store, { food: [...food], loading: false })
          },
          error: () => {
            // TODO
          },
        })
      );
    },
  })),
  withMethods((store) => ({
    getFood: rxMethod<void>(
      pipe(
        concatMap(() => {
          return store._getFood();
        })
      )
    ),
    postFood: rxMethod<Food>(
      pipe(
        concatMap((food) => {
          return store.foodService.postFood(food).pipe();
        }),
        concatMap(() => {
          return store._getFood();
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      setTimeout(() => {
        store.getFood();
      }, 5000)
    }
  })
);
