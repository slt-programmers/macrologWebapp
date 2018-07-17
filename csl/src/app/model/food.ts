import {Portion} from './portion';

export class Food {

	public id: number;
	public unitName: string;
	public unitGrams: number;
	public portions: Portion[];

	constructor(public name: string,
              public measurementUnit: string,
              public protein: number,
              public fat: number,
              public carbs: number) {

	}
}
