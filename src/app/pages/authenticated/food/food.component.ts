import { Component, OnDestroy } from '@angular/core';
import { Food } from '../../../shared/model/food';
import { Store } from '@ngrx/store';
import { selectAllFood, selectFoodLoading } from 'src/app/shared/store/selectors/food.selectors';
import { Observable, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass, AsyncPipe, DecimalPipe } from '@angular/common';
import { EditFoodComponent } from './edit-food/edit-food.component';

@Component({
    selector: 'ml-food',
    templateUrl: './food.component.html',
    imports: [FormsModule, NgClass, EditFoodComponent, AsyncPipe, DecimalPipe]
})
export class FoodComponent implements OnDestroy {

  // Displayed on one page
  public displayedFood: Food[] = [];
  public loading$: Observable<boolean>;
  public modalIsVisible = false;
  public currentPageIndex = 0;
  public itemsPerPage = 15;
  public selectedFood: Food = null; // input voor modal popup
  public searchInput = '';
  public currentSortHeader = 'name';
  public sortReverse = false;
  public displayMode = 'grams';
  public unitName = 'gram';
  public unitGrams = 100.0;

  private allFood: Food[] = [];
  private percentageFood: Food[] = []
  private searchableFood: Food[] = [];
  private foodSubscription: Subscription;

  constructor(private readonly store: Store) {
    this.foodSubscription = this.store.select(selectAllFood).subscribe(it => {
      this.allFood = it;
      this.percentageFood = this.calculatePercentages();
      this.searchableFood = this.allFood;
      this.getPagedFood(0);
    });
    this.loading$ = this.store.select(selectFoodLoading);
  }

  public hasNextPage(): boolean {
    return this.searchableFood
      .slice((this.currentPageIndex + 2) * this.itemsPerPage - this.itemsPerPage).length > 0;
  }

  public getPagedFood(pageIndex: number): void {
    this.currentPageIndex = pageIndex;
    this.displayedFood = this.searchableFood.slice(
      (pageIndex + 1) * this.itemsPerPage - this.itemsPerPage,
      (pageIndex + 2) * this.itemsPerPage - this.itemsPerPage
    );
  }

  public findFoodMatch(): void {
    const foodMatch: Food[] = [];
    for (const food of this.allFood) {
      const isMatch = food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
      if (isMatch) {
        if (this.displayMode === 'grams') {
          foodMatch.push(food);
        } else {
          foodMatch.push(this.percentageFood.filter(it => it.id === food.id)[0]);
        }
      }
    }
    this.searchableFood = foodMatch;
    this.getPagedFood(0);
  }

  public openModal(food: Food) {
    if (food) {
      this.selectedFood = JSON.parse(JSON.stringify(food)) as Food;
    } else {
      this.selectedFood = { portions: [] }
    }
    this.modalIsVisible = true;
  }

  public closeModal() {
    this.modalIsVisible = false;
  }

  public clearSearch(): void {
    this.searchInput = '';
    this.searchableFood = this.allFood;
    this.getPagedFood(0);
  }

  public sortBy(header: string): void {
    this.setReversed(header);
    const sortedArray = this.searchableFood;
    sortedArray.sort((a: Food, b: Food) => {
      if (a[header as keyof Food] < b[header as keyof Food]) {
        return 1;
      } else if (a[header as keyof Food] > b[header as keyof Food]) {
        return -1;
      } else {
        return 0;
      }
    });

    if (this.sortReverse) {
      sortedArray.reverse();
    }

    this.searchableFood = sortedArray;
    this.getPagedFood(this.currentPageIndex);
  }

  public changeDisplay(mode: string): void {
    this.currentPageIndex = 0;
    this.displayMode = mode;

    if (this.displayMode === 'grams') {
      this.searchableFood = this.allFood;
    } else {
      this.searchableFood = this.percentageFood;
    }

    this.findFoodMatch();
    this.getPagedFood(this.currentPageIndex);
  }

  private setReversed(header: string): void {
    if (this.currentSortHeader === header) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
      this.currentSortHeader = header;
    }
  }

  private calculatePercentages() {
    const percentageFood: Food[] = [];

    for (const food of this.allFood) {
      const total = food.protein + food.fat + food.carbs;
      const newProtein = (food.protein / total) * 100;
      const newFat = (food.fat / total) * 100;
      const newCarbs = (food.carbs / total) * 100;

      const newFood = {
        id: food.id,
        name: food.name,
        protein: newProtein,
        fat: newFat,
        carbs: newCarbs,
      };

      percentageFood.push(newFood);
    }
    return percentageFood;
  }

  ngOnDestroy(): void {
    this.foodSubscription.unsubscribe();
  }

}
