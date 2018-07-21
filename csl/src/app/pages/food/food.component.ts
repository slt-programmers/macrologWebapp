import{Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  public foodResult;
	public modalIsVisible: boolean = false;
  public selectedFood = 2;

  constructor(private foodService: FoodService) { }

	ngOnInit() {
    this.foodService.getAllFood().subscribe(
      data => { this.foodResult = data;
        console.log(this.foodResult);
      },
			error => console.log(error)
		);
  };

	public openModal(food) {
    this.selectedFood= food;
		this.modalIsVisible = true;
	}
  public closeModal(event) {
    console.log('refreshed');
		this.modalIsVisible = false;
	}

}
