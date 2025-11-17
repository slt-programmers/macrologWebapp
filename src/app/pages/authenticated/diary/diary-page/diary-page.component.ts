import { DecimalPipe } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { Meal } from "src/app/shared/model/meal";
import { ActivityStore } from "src/app/shared/store/activity.store";
import { EntryStore } from "src/app/shared/store/entry.store";
import { ActivityPageRowComponent } from "../activity-page-row/activity-page-row.component";
import { EntryPageRowComponent } from "../entry-page-row/entry-page-row.component";

@Component({
  selector: "ml-diary-page",
  templateUrl: "./diary-page.component.html",
  styleUrl: "./diary-page.component.css",
  imports: [EntryPageRowComponent, ActivityPageRowComponent, DecimalPipe],
})
export class DiaryPageComponent {
  private readonly entryStore = inject(EntryStore);
  private readonly activityStore = inject(ActivityStore)

  totals = this.entryStore.totalsForDay;

  readonly date = input.required<string>();

  public breakfast = Meal.Breakfast;
  public lunch = Meal.Lunch;
  public diner = Meal.Dinner;
  public snacks = Meal.Snacks;

  constructor() {
    effect(() => {
      const date = this.date();
      // TODO move to oninit in store
      this.entryStore.getEntriesForDay(date);
      this.activityStore.getActivitiesForDay({date, force: false})
    });
  }
}
