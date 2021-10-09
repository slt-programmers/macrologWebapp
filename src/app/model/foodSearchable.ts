import { Food } from './food';
import { Dish } from './dish';

export class FoodSearchable {

	public food: Food = undefined;
	public dish: Dish = undefined;

	constructor(food?: Food, dish?: Dish) {
		this.food = food;
		this.dish = dish;
	}
}
