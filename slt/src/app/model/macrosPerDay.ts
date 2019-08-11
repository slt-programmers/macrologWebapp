import { Macros } from "./macro";

export class MacrosPerDay {

  public macro: Macros;
  public day: Date;

  constructor(day?: Date, macros?: Macros, protein?: number, fat?: number, carbs?: number, calories?: number) {
    this.day = day;
    if (macros) {
      this.macro = macros;
    } else {
      let newMacros = new Macros();
      newMacros.protein = protein;
      newMacros.fat = fat;
      newMacros.carbs = carbs;
      newMacros.calories = calories;
      this.macro = newMacros;
    }
  }
}
