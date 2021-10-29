import { Macros } from './macros';

export class Portion {

	public id?: number;
	public grams?: number;
	public description?: string;
	public macros?: Macros;

	constructor(grams?: number, description?: string, macros?: Macros) {
		this.grams = grams;
		this.description = description;
		this.macros = macros;
	}
}
