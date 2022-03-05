import { dishesFeatureKey } from "../reducers/dishes.reducers";
import { selectAllDishes, selectDishesLoading, selectDishesState } from "./dishes.selectors"

describe('Dish Selectors', () => {

  it('should select dishes state', () => {
    const result = selectDishesState({[dishesFeatureKey]: {data: [{name: 'dishname'}]}});
    expect(result).toEqual({data: [{name: 'dishname'}]});
  });

  it('should select all dishes', () => {
    let result = selectAllDishes({[dishesFeatureKey]: {data: [{name: 'dishname'}]}});
    expect(result).toEqual([{name: 'dishname'}]);
    result = selectAllDishes({data: undefined});
    expect(result).toEqual([]);
  });

  it('should select dishes loading', () => {
    const result = selectDishesLoading({[dishesFeatureKey]: {loading: true}});
    expect(result).toBeTrue();
  });

});
