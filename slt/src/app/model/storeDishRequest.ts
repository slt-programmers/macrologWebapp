import {Ingredient} from './ingredient';

export class StoreDishRequest {

	public id: number;
  public title: string;
  public ingredients: Ingredient[];

	constructor () {
	}
}
