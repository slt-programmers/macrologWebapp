import { Ingredient } from "../model/ingredient";
import { Mealplan } from "../model/mealplan";
import { Mealtime } from "../model/mealtime";
import { IngredientRequest, MealplanRequest, MealtimeRequest } from "../model/requests/mealplan-request";

export class MealplanMapper {

  public static mapToRequest(mealplan: Mealplan): MealplanRequest {
    return {
      id: mealplan.id,
      title: mealplan.title,
      mealtimes: mealplan.mealtimes.map(m => this.mapMealtimeToRequest(m))
    }
  }

  private static mapMealtimeToRequest(mealtime: Mealtime): MealtimeRequest {
    return {
      id: mealtime.id,
      weekday: mealtime.weekday,
      meal: mealtime.meal,
      ingredients: mealtime.ingredients.map(i => this.mapIngredientToRequest(i))
    }
  }

  private static mapIngredientToRequest(ingredient: Ingredient): IngredientRequest {
    return {
      id: ingredient.id,
      foodId: ingredient.food.id!,
      portionId: ingredient.portion?.id || undefined,
      multiplier: ingredient.multiplier
    }
  }
}