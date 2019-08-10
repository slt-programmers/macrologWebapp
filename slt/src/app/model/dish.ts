import { Ingredient } from './ingredient';

export class Dish {

	public id: number;
	public title: string;
	public ingredients: Ingredient[];
	public macrosCalculated;

	constructor(public name: string) {

	}
}
