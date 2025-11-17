import { DecimalPipe, TitleCasePipe } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Entry } from "src/app/shared/model/entry";
import { Meal } from "src/app/shared/model/meal";
import { Portion } from "src/app/shared/model/portion";
import { EntryStore } from "src/app/shared/store/entry.store";
import { clone } from "src/app/util/functions";
import { AutocompleteFoodComponent } from "../../../../shared/components/autocomplete-food/autocomplete-food.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
	selector: "ml-entry-page-row",
	templateUrl: "./entry-page-row.component.html",
	styleUrls: ["./entry-page-row.component.css"],
	imports: [
		ModalComponent,
		FormsModule,
		AutocompleteFoodComponent,
		DecimalPipe,
		TitleCasePipe,
	],
})
export class EntryPageRowComponent {
	private readonly entryStore = inject(EntryStore);
	private readonly entriesPerDay = this.entryStore.entriesPerDay;
	
	readonly meal = input.required<Meal>();
	readonly date = input.required<string>();

	entries: Entry[] = [];
	modalEntries: Entry[] = [];
	showModal = false;

	constructor() {
		effect(() => {
			if (this.entriesPerDay()) {
				this.entries = this.entryStore.filterMeal(
					this.entryStore.filterDay(this.entriesPerDay(), this.date()),
					this.meal()
				);
			}
		});
	}

	openModal(): void {
		this.modalEntries = clone(this.entries)!;
		this.showModal = true;
	}

	changePortion(event: any, index: number) {
		if (event.target.value === "grams") {
			this.modalEntries[index].portion = undefined;
		} else {
			this.modalEntries[index].portion = this.modalEntries[
				index
			].food.portions!.filter((p) => p.id === +event.target.value)[0];
		}
	}

	changeMultiplier(event: any, index: number) {
		if (!this.modalEntries[index].portion) {
			this.modalEntries[index].multiplier = +event.target.value / 100;
		} else {
			this.modalEntries[index].multiplier = +event.target.value;
		}
	}

	addEntry(entry: any) {
		if (entry.dish) {
			for (const ingredient of entry.dish.ingredients) {
				this.modalEntries.push({
					food: ingredient.food,
					meal: this.meal(),
					day: this.date(),
					portion: ingredient.portion
						? ingredient.food.portions.filter(
								(p: Portion) => p.id === ingredient.portion.id
						  )[0]
						: undefined,
					multiplier: ingredient.multiplier,
				} as Entry);
			}
		} else {
			this.modalEntries.push({
				food: entry.food,
				meal: this.meal(),
				day: this.date(),
				portion: entry.food.portions ? entry.food.portions[0] : undefined,
				multiplier: 1,
			} as Entry);
		}
	}

	deleteEntry(index: number) {
		this.modalEntries.splice(index, 1);
	}

	saveEntries() {
		let missingInput = false;
		for (const entry of this.modalEntries) {
			if (!entry.multiplier) {
				missingInput = true;
				break;
			}
		}
		if (!missingInput) {
			this.entryStore.postEntriesForDayAndMeal({
				entries: this.modalEntries,
				date: this.date(),
				meal: this.meal(),
			});
			this.showModal = false;
			this.modalEntries = [];
		}
	}
}
