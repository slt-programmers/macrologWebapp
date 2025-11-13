import { DecimalPipe } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Meal } from "src/app/shared/model/meal";
import { activitiesActions } from "src/app/shared/store/actions/activities.actions";
import { EntriesStore } from "src/app/shared/store/entries.store";
import { ActivityPageRowComponent } from "../activity-page-row/activity-page-row.component";
import { EntryPageRowComponent } from "../entry-page-row/entry-page-row.component";

@Component({
	selector: "ml-diary-page",
	templateUrl: "./diary-page.component.html",
	styleUrl: "./diary-page.component.css",
	imports: [EntryPageRowComponent, ActivityPageRowComponent, DecimalPipe],
})
export class DiaryPageComponent {
	private readonly store = inject(Store);
	private readonly entriesStore = inject(EntriesStore);

  totals = this.entriesStore.totalsForDay;

	readonly date = input.required<string>();

	public breakfast = Meal.Breakfast;
	public lunch = Meal.Lunch;
	public diner = Meal.Dinner;
	public snacks = Meal.Snacks;

	constructor() {
		effect(() => {
			const date = this.date();
			// TODO move to oninit in store
			this.entriesStore.getEntriesForDay(date);
			this.store.dispatch(
				activitiesActions.get(false, { date: date, sync: false })
			);
		});
	}
}
