import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Macros } from 'src/app/shared/model/macros';
import { Meal } from 'src/app/shared/model/meal';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectTotalsForDate } from 'src/app/shared/store/selectors/entries.selectors';
import { EntryPageRowComponent } from '../entry-page-row/entry-page-row.component';
import { ActivityPageRowComponent } from '../activity-page-row/activity-page-row.component';
import { NgIf, AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'ml-diary-page',
    templateUrl: './diary-page.component.html',
    imports: [EntryPageRowComponent, ActivityPageRowComponent, NgIf, AsyncPipe, DecimalPipe]
})
export class DiaryPageComponent implements OnChanges {

  @Input() date: string;

  public breakfast = Meal.Breakfast;
  public lunch = Meal.Lunch;
  public diner = Meal.Dinner;
  public snacks = Meal.Snacks;

  public totals$: Observable<Macros>;
  
  constructor(private readonly store: Store) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date) {
      this.store.dispatch(entriesActions.get(false, this.date));
      this.store.dispatch(activitiesActions.get(false, {date: this.date, sync: false}));
      this.totals$ = this.store.select(selectTotalsForDate(this.date));
    }
  }

}
