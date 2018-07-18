import {Portion} from './portion';
import {Food} from './food';

export class FoodSearchable {

public food: Food;
public portion: Portion;

constructor(public food: Food,
              public portion: Portion) {

	}
}
