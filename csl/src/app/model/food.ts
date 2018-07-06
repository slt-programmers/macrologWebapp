import {Portion} from './portion';

export class Food {
  public name: string;
  public unit: string;
  public unitName: string;
  public unitGrams: number;
  public protein: number;
  public fat: number;
  public carbs: number;
  public portions: Portion[];
	constructor() {}
}
/*
export class Food {
	constructor(
		public name: string,
		public unit: number,
		public unitName: String,
		public optionalGrams: number,
		public protein: number,
		public fat: number,
		public carbs: number,
	) {}

}
*/
