export class LogEntry {

  public description:string;
	public grams: number;
  public meal: string;
	public food;
	public portion;
	public multiplier = 1;

	constructor (description?:string, grams?:number, meal?:string) {
    this.description = description;
    this.grams = grams;
		this.meal = meal;
	}
}
