import {Ingredient} from './ingredient';

export class StoreDishRequest {

	public id: number;
  public name: string;
  public ingredients: Ingredient[];

	constructor () {
	}
}
