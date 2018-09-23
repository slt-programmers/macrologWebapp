import {Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';
import {Food} from '../../model/food';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit {

  private foodResult = new Array();;
	public pagedFood = new Array<Food>();
	public searchableFood = new Array<Food>();
	public modalIsVisible: boolean = false;
	public currentPage = 1;
	public itemsPerPage = 15;
  public selectedFood = null; // input voor modal popup
	public searchInput = '';

  constructor(private foodService: FoodService) { }

	ngOnInit() {
     this.loadAllFood();
  };

	private loadAllFood(){
    this.foodService.getAllFood().subscribe(
      data => {
        this.foodResult = data;
				this.searchableFood = this.foodResult;
        this.getPagedFood(this.currentPage);
      },
			error => console.log(error)
		);
  }

	getPagedFood(page: number): void {
		this.pagedFood = this.searchableFood.slice(
			(page * this.itemsPerPage) - this.itemsPerPage,
			((page + 1) * this.itemsPerPage) - this.itemsPerPage);
	}

	public findFoodMatch(): void {
		console.log(this.searchInput);
		let foodMatch = new Array<Food>();
		for (let food of this.foodResult) {
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
		this.searchableFood = this.foodResult;
		this.currentPage = 1;
		this.getPagedFood(this.currentPage);
	}


}
