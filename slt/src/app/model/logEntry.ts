import { Food } from './food';
import { Portion } from './portion';

export class LogEntry {

	public id: number;
	public dish: string;
	public food: Food;
	public portion: Portion;
	public multiplier = 1;
	public day: Date;
	public macrosCalculated;

	constructor() {

	}
}
