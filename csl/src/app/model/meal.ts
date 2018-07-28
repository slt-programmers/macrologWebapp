import { Food } from './food';

export class Meal {

	public id: number;
	public title: string;
	public ingredients: Food[];
	public macrosCalculated;

	constructor(public name: string) {
	}
}
