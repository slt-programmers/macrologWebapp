import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { Dish } from "../model/dish";
import { DishService } from "../services/dish.service";

interface DishState {
	dishes: Dish[];
}

const initialState: DishState = {
	dishes: [],
};

export const DishStore = signalStore(
	{ providedIn: "root" },
	withState(initialState),
	withProps(() => ({
		dishService: inject(DishService),
	})),
	withMethods((store) => ({
		_getDishes: () => {
			return store.dishService.getDishes().pipe(
				tapResponse({
					next: (response) => {
						patchState(store, { dishes: response });
					},
					error: () => {
						// TODO
					},
				})
			);
		},
	})),
	withMethods((store) => ({
		getDishes: rxMethod<void>(
			pipe(
				concatMap(() => {
					return store._getDishes();
				})
			)
		),
		postDish: rxMethod<Dish>(
			pipe(
				concatMap((dish) => {
					return store.dishService.postDish(dish);
				}),
				concatMap(() => {
					return store._getDishes();
				})
			)
		),
		deleteDish: rxMethod<number>(
			pipe(
				concatMap((id) => {
					return store.dishService.deleteDish(id);
				}),
				concatMap(() => {
					return store._getDishes();
				})
			)
		),
	}))
);
