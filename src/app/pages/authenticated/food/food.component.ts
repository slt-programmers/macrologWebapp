import { Component, OnDestroy } from '@angular/core';
import { Food } from '../../../shared/model/food';
import { Store } from '@ngrx/store';
import { selectAllFood, selectFoodLoading } from 'src/app/shared/store/selectors/food.selectors';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ml-food',
  templateUrl: './food.component.html'
})
export class FoodComponent implements OnDestroy {
  // All food from database, don't overwrite
  private allFood = new Array();

  // All food but converted to percentages of macro's
  public percentageFood = new Array();

  // All food after search, sorted
  public searchableFood = new Array();

  // Displayed on one page
  public displayedFood = new Array();

  public loading$: Observable<boolean>;
  public modalIsVisible = false;
  public modalTitle = 'Add food';
  public currentPage = 1;
  public itemsPerPage = 15;
  public selectedFood: Food = null; // input voor modal popup
  public searchInput = '';
  public currentSortHeader = 'name';
  public sortReverse = false;
  public displayMode = 'grams';
  public unitName = 'gram';
  public unitGrams = 100.0;

  private foodSubscription: Subscription;

  constructor(private readonly store: Store) { 
    this.foodSubscription = this.store.select(selectAllFood).subscribe(it => {
      this.allFood = it;
      this.percentageFood = this.calculatePercentages();
      this.searchableFood = this.allFood;
      this.getPagedFood({ pageIndex: 0 });
    });
    this.loading$ = this.store.select(selectFoodLoading);
  }

  public hasNextPage(): boolean {
    return this.searchableFood
      .slice((this.currentPage + 1) * this.itemsPerPage - this.itemsPerPage).length > 0;
  }

  public getPagedFood(page: any): void {
    this.currentPage = page.pageIndex + 1;
    this.displayedFood = this.searchableFood.slice(
      (page.pageIndex + 1) * this.itemsPerPage - this.itemsPerPage,
      (page.pageIndex + 2) * this.itemsPerPage - this.itemsPerPage
    );
  }

  public findFoodMatch(): void {
    const foodMatch: Food[] = [];
    for (const food of this.allFood) {
      const matchFoodName = food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
      if (matchFoodName) {
        foodMatch.push(food);
      }
    }
    this.searchableFood = foodMatch;
    this.getPagedFood({ pageIndex: 0 });
  }

  public openModal(food: Food) {
    if (food) {
      this.modalTitle = 'Edit food';
      this.selectedFood = JSON.parse(JSON.stringify(food)) as Food;
    } else {
      this.modalTitle = 'Add food';
      this.selectedFood = {
        portions: []
      }
    }
    this.modalIsVisible = true;
  }

  public closeModal() {
    this.modalIsVisible = false;
  }

  public clearSearch(): void {
    this.searchInput = '';
    this.searchableFood = this.allFood;
    this.getPagedFood({ pageIndex: 0 });
  }

  private setReversed(header: string): void {
    if (this.currentSortHeader === header) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
      this.currentSortHeader = header;
    }
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
    this.getPagedFood({pageIndex: this.currentPage -1});
  }

  public changeDisplay(mode: string): void {
    this.currentPage = 1;
    this.displayMode = mode;

    if (this.displayMode === 'grams') {
      this.searchableFood = this.allFood;
    } else {
      this.searchableFood = this.percentageFood;
    }

    this.findFoodMatch();
    this.getPagedFood(this.currentPage);
  }

  private calculatePercentages() {
    const percentageFood = new Array();

    for (const food of this.allFood) {
      const total = food.protein + food.fat + food.carbs;
      const newProtein = (food.protein / total) * 100;
      const newFat = (food.fat / total) * 100;
      const newCarbs = (food.carbs / total) * 100;

      const newFood = {
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
