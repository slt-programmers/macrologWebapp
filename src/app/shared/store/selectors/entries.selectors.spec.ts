import { Meal } from "../../model/meal";
import { entriesFeatureKey } from "../reducers/entries.reducers";
import { selectEntries, selectEntriesDate, selectEntriesDateMeal, selectEntriesState, selectTotalsForDate } from "./entries.selectors";

describe('Entries Selectors', () => {

  it('should select entriesState', () => {
    let result = selectEntriesState({ [entriesFeatureKey]: { data: [] } });
    expect(result).toEqual({ data: [] });
    result = selectEntriesState({ [entriesFeatureKey]: { data: undefined } });
    expect(result).toEqual({ data: undefined });
  });

  it('should select entries', () => {
    let result = selectEntries({ [entriesFeatureKey]: { data: [] } });
    expect(result).toEqual([]);
    result = selectEntries({ [entriesFeatureKey]: { data: undefined } });
    expect(result).toEqual([]);
  });

  it('should select entries for date', () => {
    let result = selectEntriesDate('2022-01-01')({
      [entriesFeatureKey]: {
        data: [{ date: '2022-01-01', entries: [] }]
      }
    });
    expect(result).toEqual([]);
    result = selectEntriesDate('2022-01-01')({ [entriesFeatureKey]: { data: [{ date: '2022-01-01' }] } });
    expect(result).toEqual(undefined);
    result = selectEntriesDate('2022-01-01')({ [entriesFeatureKey]: { data: undefined } });
    expect(result).toEqual(undefined);
    result = selectEntriesDate('2022-01-01')({ [entriesFeatureKey]: { data: [{ date: '2022-01-02', entries: [] }] } });
    expect(result).toEqual(undefined);
  });

  it('should select entries for date and meal', () => {
    let result = selectEntriesDateMeal('2022-01-01', Meal.Breakfast)({
      [entriesFeatureKey]: {
        data: [{
          date: '2022-01-01', entries: [
            { meal: Meal.Breakfast, food: { id: 123 } },
            { meal: Meal.Lunch, food: { id: 234 } }
          ]
        }]
      }
    });
    expect(result).toEqual([{ meal: Meal.Breakfast, food: { id: 123 } }]);
    result = selectEntriesDateMeal('2022-01-01', Meal.Breakfast)({[entriesFeatureKey]: {
      data: undefined
    }});
    expect(result).toBeUndefined();
    result = selectEntriesDateMeal('2022-01-01', Meal.Breakfast)({[entriesFeatureKey]: {
      data: [{date: '2022-01-02', entries: [{meal: Meal.Breakfast, food: {id: 123}}]}]
    }});
    expect(result).toBeUndefined();
    result = selectEntriesDateMeal('2022-01-01', Meal.Breakfast)({[entriesFeatureKey]: {
      data: [{date: '2022-01-01', entries: [{meal: Meal.Lunch, food: {id: 123}}]}]
    }});
    expect(result).toEqual([]);
  });

  it('should select totals for date', () => {
    let result = selectTotalsForDate('2022-01-01')({[entriesFeatureKey]: {
      data: [{date: '2022-01-01', entries: [
        {macrosCalculated: {protein: 1, fat: 2, carbs: 3, calories: 100}},
        {macrosCalculated: {protein: 2, fat: 3, carbs: 4, calories: 200}}
      ]}]
    }});
    expect(result).toEqual({protein: 3, fat: 5, carbs:7, calories: 300});

    result = selectTotalsForDate('2022-01-01')({[entriesFeatureKey]: {
      data: undefined
    }});
    expect(result).toEqual({protein: 0, fat: 0, carbs: 0, calories: 0});
  });

});
