import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Macros } from 'src/app/shared/model/macros';
import { Meal } from 'src/app/shared/model/meal';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectTotalsForDate } from 'src/app/shared/store/selectors/entries.selectors';
import { ActivityPageRowComponent } from '../activity-page-row/activity-page-row.component';
import { EntryPageRowComponent } from '../entry-page-row/entry-page-row.component';

@Component({
  selector: 'ml-diary-page',
  templateUrl: './diary-page.component.html',
  styleUrl: './diary-page.component.css',
  imports: [EntryPageRowComponent, ActivityPageRowComponent, AsyncPipe, DecimalPipe]
})
export class DiaryPageComponent {
  private readonly store = inject(Store);
  readonly date = input.required<string>();

  public breakfast = Meal.Breakfast;
  public lunch = Meal.Lunch;
  public diner = Meal.Dinner;
  public snacks = Meal.Snacks;

  public totals$?: Observable<Macros>;

  constructor() {
    effect(() => {
      const date = this.date();
      this.store.dispatch(entriesActions.get(false, date));
      this.store.dispatch(activitiesActions.get(false, { date: date, sync: false }));
      this.totals$ = this.store.select(selectTotalsForDate(date));
    });
  }

}
