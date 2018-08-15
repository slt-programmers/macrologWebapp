import{Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html'
})
export class FoodComponent implements OnInit {

  public foodResult = new Array();
	public pagedFood = new Array();
	public modalIsVisible: boolean = false;
	public currentPage = 1;
	public itemsPerPage = 15;
  public selectedFood = null; // input voor modal popup

  constructor(private foodService: FoodService) { }

	ngOnInit() {
     this.loadAllFood();
  };

	private loadAllFood(){
    this.foodService.getAllFood().subscribe(
      data => { this.foodResult = data;
        this.getPagedFood(this.currentPage);
      },
			error => console.log(error)
		);
  }

	getPagedFood(page: number) {
		this.pagedFood = this.foodResult.slice(
			(page * this.itemsPerPage) - this.itemsPerPage,
			((page + 1) * this.itemsPerPage) - this.itemsPerPage);
	}

	public openModal(food) {
    this.selectedFood = food;
		this.modalIsVisible = true;
	}

  public closeModal(event) {
    this.loadAllFood();
		this.modalIsVisible = false;
	}

}
