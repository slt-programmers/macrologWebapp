import { DecimalPipe } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Portion } from "src/app/shared/model/portion";
import { FoodStore } from "src/app/shared/store/food.store";
import { Food } from "../../../shared/model/food";
import { EditFoodComponent } from "./edit-food/edit-food.component";
import { Spinner } from "src/app/shared/components/spinner/spinner";

@Component({
	selector: "ml-food",
	templateUrl: "./food.component.html",
	imports: [FormsModule, EditFoodComponent, DecimalPipe, Spinner],
})
export class FoodComponent {
	private readonly foodStore = inject(FoodStore);
  private allFood = this.foodStore.food;
	private percentageFood: Food[] = [];
	private searchableFood: Food[] = [];

  loading = this.foodStore.loading;

	// Displayed on one page
	displayedFood: Food[] = [];
	modalIsVisible = false;
	currentPageIndex = 0;
  
	selectedFood: Food | null = null; // input voor modal popup
	searchInput = "";
	currentSortHeader = "name";
	sortReverse = false;
	displayMode = "grams";
  
	readonly itemsPerPage = 15;
	readonly unitName = "gram";
	readonly unitGrams = 100.0;



	constructor() {
		effect(() => {
			if (this.allFood()) {
				this.percentageFood = this.calculatePercentages();
				this.searchableFood = this.allFood();
				this.getPagedFood(0);
			}
		});
	}

	public hasNextPage(): boolean {
		return (
			this.searchableFood.slice(
				(this.currentPageIndex + 2) * this.itemsPerPage - this.itemsPerPage
			).length > 0
		);
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
		for (const food of this.allFood()) {
			const isMatch =
				food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
			if (isMatch) {
				if (this.displayMode === "grams") {
					foodMatch.push(food);
				} else {
					foodMatch.push(
						this.percentageFood.filter((it) => it.id === food.id)[0]
					);
				}
			}
		}
		this.searchableFood = foodMatch;
		this.getPagedFood(0);
	}

	public openModal(food: Food | null) {
		if (food) {
			this.selectedFood = JSON.parse(JSON.stringify(food)) as Food;
		} else {
			this.selectedFood = { portions: [] as Portion[] } as Food;
		}
		this.modalIsVisible = true;
	}

	public closeModal() {
		this.modalIsVisible = false;
	}

	public clearSearch(): void {
		this.searchInput = "";
		this.searchableFood = this.allFood();
		this.getPagedFood(0);
	}

	public sortBy(header: string): void {
		this.setReversed(header);
		const sortedArray = this.searchableFood;
		sortedArray.sort((a: Food, b: Food) => {
			if (a[header as keyof Food]! < b[header as keyof Food]!) {
				// TODO refactor
				return 1;
			} else if (a[header as keyof Food]! > b[header as keyof Food]!) {
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

		if (this.displayMode === "grams") {
			this.searchableFood = this.allFood();
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

		for (const food of this.allFood()) {
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
}
