import { Ingredient } from './ingredient';
import { Macro } from './macro';

export class Dish {

	public id: number;
	public title: string;
	public ingredients: Ingredient[];
	public macrosCalculated;

	constructor(public name: string) {

	}
}
