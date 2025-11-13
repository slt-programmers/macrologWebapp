import {
	patchState,
	signalStore,
	withComputed,
	withMethods,
	withProps,
	withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { concatMap, pipe } from "rxjs";
import { DiaryService } from "../services/diary.service";
import { computed, inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { Entry } from "../model/entry";
import { formatDate } from "@angular/common";
import { Macros } from "../model/macros";
import { Meal } from "../model/meal";

interface EntriesPerDay {
	date: string;
	entries: Entry[];
}

interface EntriesState {
	displayDate: string;
	entriesPerDay: EntriesPerDay[];
}

const initialState: EntriesState = {
	displayDate: formatDate(new Date(), "yyyy-MM-dd", "en-US"),
	entriesPerDay: [],
};

export const EntriesStore = signalStore(
	{ providedIn: "root" },
	withState(initialState),
	withProps(() => ({
		entriesService: inject(DiaryService),
	})),
	withComputed((store) => ({
		totalsForDay: computed(() => {
			const totals: Macros = {
				protein: 0,
				fat: 0,
				carbs: 0,
				calories: 0,
			};
			const entriesForDay = store
				.entriesPerDay()
				.filter((epd) => epd.date === store.displayDate())[0];
			if (entriesForDay) {
				for (const entry of entriesForDay.entries) {
					totals.protein += entry.macrosCalculated.protein;
					totals.fat += entry.macrosCalculated.fat;
					totals.carbs += entry.macrosCalculated.carbs;
					totals.calories += entry.macrosCalculated.calories;
				}
			}
			return totals;
		}),
	})),
	withMethods(() => ({
		_filterDay(entriesPerDay: EntriesPerDay[], date: string): EntriesPerDay {
			return entriesPerDay.filter((epd) => epd.date === date)[0];
		},
		filterDay(entriesPerDay: EntriesPerDay[], date: string): Entry[] {
			return entriesPerDay.filter((epd) => epd.date === date)[0]?.entries || [];
		},
		filterMeal(entries: Entry[], meal: Meal): Entry[] {
			return entries.filter((e) => e.meal === meal);
		},
	})),
	withMethods((store) => ({
		setDisplayDate(displayDate: string) {
			patchState(store, { displayDate });
		},
		getEntriesForDay: rxMethod<string>(
			pipe(
				concatMap((date: string) => {
					return store.entriesService.getEntriesPerDay(date).pipe(
						tapResponse({
							next: (response) => {
								const allEntriesPerDay = store.entriesPerDay();
								const entriesOnDay = store._filterDay(allEntriesPerDay, date);
								if (entriesOnDay) {
									entriesOnDay.entries = response;
								} else {
									allEntriesPerDay.push({ date, entries: response });
								}
								patchState(store, { entriesPerDay: [...allEntriesPerDay] });
							},
							error: () => {
								// TODO
							},
						})
					);
				})
			)
		),
		postEntriesForDayAndMeal: rxMethod<{
			entries: Entry[];
			date: string;
			meal: Meal;
		}>(
			pipe(
				concatMap((request) => {
					return store.entriesService
						.postMacrosPerDayPerMeal(
							request.entries,
							request.date,
							request.meal
						)
						.pipe(
							tapResponse({
								next: (response: Entry[]) => {
									const allEntriesPerDay = store.entriesPerDay();
									const entriesOnDay = store._filterDay(
										allEntriesPerDay,
										request.date
									);
									entriesOnDay.entries = response;
									patchState(store, { entriesPerDay: [...allEntriesPerDay] });
								},
								error: () => {
									// TODO
								},
							})
						);
				})
			)
		),
	}))
);
