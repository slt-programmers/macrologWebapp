import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Entry } from 'src/app/shared/model/entry';
import { Meal } from 'src/app/shared/model/meal';
import { Portion } from 'src/app/shared/model/portion';
import { entriesActions } from 'src/app/shared/store/actions/entries.actions';
import { selectEntriesDateMeal } from 'src/app/shared/store/selectors/entries.selectors';
import { clone } from 'src/app/util/functions';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteFoodComponent } from '../../../../shared/components/autocomplete-food/autocomplete-food.component';

@Component({
    selector: 'ml-entry-page-row',
    templateUrl: './entry-page-row.component.html',
    styleUrls: ['./entry-page-row.component.scss'],
    imports: [ModalComponent, FormsModule, AutocompleteFoodComponent, DecimalPipe, TitleCasePipe]
})
export class EntryPageRowComponent implements OnChanges, OnDestroy {

  @Input() meal: Meal;
  @Input() date: string;

  public entries: Entry[];
  public modalEntries: Entry[];
  public showModal = false;

  private subscriptions: Subscription[] = [];

  constructor(private readonly store: Store) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.push(this.store.select(selectEntriesDateMeal(this.date, this.meal)).subscribe(it => {
      this.entries = clone(it);
    }));
  }

  openModal(): void {
    this.modalEntries = clone(this.entries);
    this.showModal = true;
  }

  changePortion(event: any, index: number) {
    if (event.target.value === 'grams') {
      this.modalEntries[index].portion = undefined;
    } else {
      this.modalEntries[index].portion =
        this.modalEntries[index].food.portions.filter(p => p.id === +event.target.value)[0];
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
          meal: this.meal,
          day: this.date,
          portion: ingredient.portion ? ingredient.food.portions
            .filter((p: Portion) => p.id === ingredient.portion.id)[0] : undefined,
          multiplier: ingredient.multiplier
        });
      }
    } else {
      this.modalEntries.push({
        food: entry.food,
        meal: this.meal,
        day: this.date,
        portion: entry.food.portions ? entry.food.portions[0] : undefined,
        multiplier: 1
      });
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
      this.store.dispatch(entriesActions.post(this.modalEntries, { date: this.date, meal: this.meal }));
      this.showModal = false;
      this.modalEntries = undefined;
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
