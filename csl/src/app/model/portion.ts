export class Portion {

	public id: number;
	public grams: number;
	public unit: number;
	public description: string;
	public macros;

	constructor () {
		this.grams = 0;
		this.unit = 0;
		this.description = null;
		this.macros = {'protein': 0, 'fat': 0, 'carbs': 0};
	}
}
