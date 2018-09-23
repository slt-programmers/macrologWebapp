import {Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';
import {Food} from '../../model/food';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit {

	// All food from database, don't overwrite
  private allFoodFromDB = new Array();

	// All food after search, sorted
	public searchableFood = new Array<Food>();

	// Displayed on one page
	public displayedFood = new Array<Food>();

	public modalIsVisible: boolean = false;
	public currentPage = 1;
	public itemsPerPage = 15;
  public selectedFood = null; // input voor modal popup
	public searchInput = '';
	public currentSortHeader = 'name';
	public sortReverse = false;

  constructor(private foodService: FoodService) { }

	ngOnInit() {
     this.loadAllFood();
  };

	private loadAllFood(){
    this.foodService.getAllFood().subscribe(
      data => {
        this.allFoodFromDB = data;
				this.searchableFood = this.allFoodFromDB;
        this.getPagedFood(this.currentPage);
      },
			error => console.log(error)
		);
  }

	public getPagedFood(page: number): void {
		this.displayedFood = this.searchableFood.slice(
			(page * this.itemsPerPage) - this.itemsPerPage,
			((page + 1) * this.itemsPerPage) - this.itemsPerPage);
	}

	public findFoodMatch(): void {
		console.log(this.searchInput);
		let foodMatch = new Array<Food>();
		for (let food of this.allFoodFromDB) {
      let matchFoodName = food.name.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0;
			if (matchFoodName) {
				foodMatch.push(food);
			}
		}

		this.currentPage = 1;
		this.searchableFood = foodMatch;
		this.getPagedFood(this.currentPage);
	}

	public openModal(food) {
    this.selectedFood = food;
		this.modalIsVisible = true;
	}

  public closeModal(event) {
    this.loadAllFood();
		this.modalIsVisible = false;
	}

	public clearSearch(): void {
		this.searchInput = '';
		this.searchableFood = this.allFoodFromDB;
		this.currentPage = 1;
		this.getPagedFood(this.currentPage);
	}

	private setReversed(header: string): void {
		if (this.currentSortHeader === header) {
			this.sortReverse = !this.sortReverse;
		} else {
			if (header === 'name') {
				this.sortReverse = true;
			} else {
				this.sortReverse = false;
			}
			this.currentSortHeader = header;
		}
	}

	public sortBy(header: string): void {
		this.setReversed(header);

		let sortedArray = this.searchableFood;
		sortedArray.sort((a: Food, b: Food) => {
			if (a[header] < b[header]) {
				return 1;
			} else if (a[header] > b[header]) {
				return -1;
			} else {
				return 0;
			}
		});

		if(this.sortReverse) {
			sortedArray.reverse();
		}

		this.searchableFood = sortedArray;
		this.getPagedFood(this.currentPage);
	}



}
