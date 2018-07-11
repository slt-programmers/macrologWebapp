export class LogEntry {

  public description:string;
	public grams: number;
  public meal:string;
	constructor (description?:string, grams?:number) {
    this.description = description;
    this.grams = grams;
	}
}
