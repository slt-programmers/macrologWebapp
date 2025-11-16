import { TestBed } from "@angular/core/testing"
import { EntryStore } from "./entries.store";
import { EntryService } from "../services/entry.service";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { Meal } from "../model/meal";
import { DateStore } from "./date.store";

describe("EntryStore", () => {
  let store: any;
  let entryService: EntryService
  let dateStore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntryStore, DateStore, MockProvider(EntryService)]
    });

    entryService = TestBed.inject(EntryService);
    dateStore = TestBed.inject(DateStore)
    store = TestBed.inject(EntryStore);
  });

  it('should get entries for date', () => {
    const serviceSpy = spyOn(entryService, 'getEntriesPerDay');
    serviceSpy.and.returnValue(of([]));
    store.getEntriesForDay('2020-01-01');

    let result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [] }]);

    const entry1 = getSimpleEntry();
    serviceSpy.and.returnValue(of([entry1]));
    store.getEntriesForDay('2020-01-01');
    expect(entryService.getEntriesPerDay).toHaveBeenCalledWith('2020-01-01');
    result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [entry1] }]);

    const entry2 = getSimpleEntry();
    entry2.day = '2020-01-02';
    const entry3 = getSimpleEntry();
    entry3.day = '2020-01-02'
    serviceSpy.and.returnValue(of([entry2, entry3]));
    store.getEntriesForDay('2020-01-02');
    result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [entry1] },
    { date: '2020-01-02', entries: [entry2, entry3] }]);

    const entry4 = getSimpleEntry();
    entry4.food.name = 'something else';
    serviceSpy.and.returnValue(of([entry4]));
    store.getEntriesForDay('2020-01-01');
    result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [entry4] },
    { date: '2020-01-02', entries: [entry2, entry3] }]);
  });

  it('should get totals for day', () => {
    const serviceSpy = spyOn(entryService, 'getEntriesPerDay');
    const entry1 = getSimpleEntry();
    serviceSpy.and.returnValue(of([entry1, entry1, entry1]));
    store.getEntriesForDay('2020-01-01');

    dateStore.setDisplayDate('2020-01-01');
    const result = store.totalsForDay();
    expect(result).toEqual({ protein: 3, fat: 6, carbs: 9, calories: 369 });
  });

  it('should filter day and meal', () => {
    const serviceSpy = spyOn(entryService, 'getEntriesPerDay');
    const entry1 = getSimpleEntry();
    const entry2 = getSimpleEntry();
    entry2.meal = Meal.Lunch;
    serviceSpy.and.returnValue(of([entry1, entry2]));
    store.getEntriesForDay('2020-01-01');

    let result = store.filterDay(store.entriesPerDay(), '2020-01-01');
    expect(result).toEqual([entry1, entry2]);
    result = store.filterDay(store.entriesPerDay(), '2020-01-03');
    expect(result).toEqual([]);

    result = store.filterMeal(store.filterDay(store.entriesPerDay(), '2020-01-01'), Meal.Breakfast);
    expect(result).toEqual([entry1])
  });

  it('should post entries for day and meal', () => {
    const entry1 = getSimpleEntry();
    const serviceSpy = spyOn(entryService, 'postEntriesPerDayPerMeal')
    serviceSpy.and.returnValue(of([entry1]));
    console.log()

    store.postEntriesForDayAndMeal({ entries: [entry1], date: '2020-01-01', meal: Meal.Breakfast });
    expect(entryService.postEntriesPerDayPerMeal).toHaveBeenCalled();
    let result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [entry1] }]);

    serviceSpy.and.returnValue(of([entry1, entry1]));
    store.postEntriesForDayAndMeal({ entries: [entry1], date: '2020-01-01', meal: Meal.Breakfast });
    result = store.entriesPerDay();
    expect(result).toEqual([{ date: '2020-01-01', entries: [entry1, entry1] }]);
  });
});

function getSimpleEntry() {
  return {
    id: 1,
    food: {
      id: 1, name: 'food1',
      protein: 1, fat: 2, carbs: 3
    },
    meal: Meal.Breakfast,
    day: '2020-01-01',
    macrosCalculated: {
      protein: 1, fat: 2, carbs: 3, calories: 123
    }
  }
}