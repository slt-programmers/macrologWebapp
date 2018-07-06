import {Portion} from './portion';

export class Food {

  public name: string;
  public measurementUnit: string;
  public unitName: string;
  public unitGrams: number;
  public protein: number;
  public fat: number;
  public carbs: number;
  public portions: Portion[];

	constructor() {}
}
