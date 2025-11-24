import { Food } from "./food";
import { Meal } from "./meal";
import { Weekday } from "./weekday";

export interface Mealtime {
  id: number;
  meal: Meal;
  weekday: Weekday;
  name: string;
  items: Food[];
}

