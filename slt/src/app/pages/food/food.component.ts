import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';
import { Food} from '../../model/food';

@Component({
	selector: 'app-food',
	templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit {

	// All food from database, don't overwrite
	private allFoodFromDB = new Array();

	// All food but converted to percentages of macro's
	public percentageFood = new Array();

	// All food after search, sorted
	public searchableFood = new Array();

	// Displayed on one page
	public displayedFood = new Array();

	public modalIsVisible = false;
	public currentPage = 1;
	public itemsPerPage = 15;
	public selectedFood = null; // input voor modal popup
	public searchInput = '';
	public currentSortHeader = 'name';
	public sortReverse = false;
	public displayMode = 'grams';
	public unitName = 'gram';
	public unitGrams = 100.00;

	constructor(private foodService: FoodService) { }

	ngOnInit() {
		this.loadAllFood();
	}

	private loadAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
				this.allFoodFromDB = data;
				this.percentageFood = this.calculatePercentages();
				this.searchableFood = this.allFoodFromDB;
				this.getPagedFood(1);
			},
			error => console.log(error)
		);
	}

	public getPagedFood(page: number): void {
		this.currentPage = page;
		this.displayedFood = this.searchableFood.slice(
			(page * this.itemsPerPage) - this.itemsPerPage,
			((page + 1) * this.itemsPerPage) - this.itemsPerPage);
	}

	public findFoodMatch(): void {
		const foodMatch = new Array<Food>();
		for (const food of this.searchableFood) {
			const matchFoodName = food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
			if (matchFoodName) {
				foodMatch.push(food);
			}
		}

		this.searchableFood = foodMatch;
	}

	public openModal(food: Food) {
		this.selectedFood = null;
		if (food !== null && (food.id === undefined || food.id === null)) {
			for (const searchableFood of this.allFoodFromDB) {
				if (searchableFood.name === food.name) {
					this.selectedFood = searchableFood;
				}
			}
		} else {
			this.selectedFood = food;
		}

		this.modalIsVisible = true;
	}

	public closeModal(event) {
		this.loadAllFood();
		this.modalIsVisible = false;
	}

	public clearSearch(): void {
		this.searchInput = '';
		this.searchableFood = this.allFoodFromDB;
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
			if (a[header] < b[header]) {
				return 1;
			} else if (a[header] > b[header]) {
				return -1;
			} else {
				return 0;
			}
		});

		if (this.sortReverse) {
			sortedArray.reverse();
		}

		this.searchableFood = sortedArray;
		this.getPagedFood(this.currentPage);
	}

	public changeDisplay(mode: string): void {
		this.currentPage = 1;
		this.displayMode = mode;

		if (this.displayMode === 'grams') {
			this.searchableFood = this.allFoodFromDB;
		} else {
			this.searchableFood = this.percentageFood;
		}

		this.findFoodMatch();
		this.getPagedFood(this.currentPage);
	}

	private calculatePercentages() {
		const percentageFood = new Array();

		for (const food of this.allFoodFromDB) {
			const total = food.protein + food.fat + food.carbs;
			const newProtein = food.protein / total * 100;
			const newFat = food.fat / total * 100;
			const newCarbs = food.carbs / total * 100;

			const newFood = { name: food.name,
					protein: newProtein,
					fat: newFat,
					carbs: newCarbs
			};

			percentageFood.push(newFood);
		}
		return percentageFood;
	}
}
