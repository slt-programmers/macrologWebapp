import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Food } from '../../../model/food';
import { Portion } from '../../../model/portion';
import { FoodService } from '../../../services/food.service';
import { ScrollBehaviourService } from '../../../services/scroll-behaviour.service';

@Component({
  selector: 'add-food-modal',
  templateUrl: './add-food-modal.component.html',
})
export class AddFoodModalComponent implements OnInit {
  @Input() food: Food;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  public title = 'Add food';
  public name = '';
  public unitName = 'gram';
  public unitGrams = 100.0;
  public protein: number;
  public fat: number;
  public carbs: number;
  public portions: Portion[] = [];

  constructor(private foodService: FoodService,
    private scrollBehaviourService: ScrollBehaviourService) { }

  ngOnInit(): void {
    this.scrollBehaviourService.preventScrolling(true);
    if (this.food) {
      this.title = 'Edit food';
      this.name = this.food.name;
      this.protein = this.food.protein;
      this.fat = this.food.fat;
      this.carbs = this.food.carbs;

      if (this.food.portions) {
        // To make a deep copy of the portions array
        this.portions = JSON.parse(JSON.stringify(this.food.portions));
      } else {
        this.portions = [];
      }
    }
  }

  public saveFood(): void {
    const newFood: Food = {
      name: this.name,
      protein: this.protein,
      fat: this.fat,
      carbs: this.carbs
    };
    if (this.food) {
      newFood.id = this.food.id;
    }
    newFood.portions = this.portions;

    this.foodService.addFood(newFood).subscribe(() => {
      this.closeModal();
    });
  }

  public closeModal(): void {
    this.scrollBehaviourService.preventScrolling(false);
    this.close.emit(true);
  }

  public isNewPortion(portion: Portion): boolean {
    if (portion.id !== null && portion.id !== undefined && portion.id !== 0) {
      return false;
    }
    return true;
  }

  public addNewPortion(): void {
    this.portions.push(new Portion());
  }

  public removePortion(index: number): void {
    this.portions.splice(index, 1);
  }

}
