import {Food} from './food';
import {Portion} from './portion';

export class Ingredient {

	public food: Food;
	public foodId: number;
	public portion: Portion;
	public portionId: number;
	public multiplier = 1;

	constructor() {
	}

}
