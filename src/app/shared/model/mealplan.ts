import { Mealtime } from "./mealtime";

export interface Mealplan {
  id: number;
  title: string;
  mealtimes: Mealtime[];
}

