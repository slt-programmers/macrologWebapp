import { Entry } from '../shared/model/entry';
import { Gender } from '../shared/model/gender';

// TODO move calculations to backend
export function calculateTDEE(
  gender: Gender,
  weight: number,
  height: number,
  age: number
): number {
  if (gender === 'MALE') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function setMacrosCalculated(logEntry: Entry) {
  const protein = multiplyMacro(logEntry, 'protein');
  const carbs = multiplyMacro(logEntry, 'fat');
  const fat = multiplyMacro(logEntry, 'carbs');
  const calories = protein * 4 + fat * 9 + carbs * 4;
  logEntry.macrosCalculated = {
    protein: protein,
    fat: fat,
    carbs: carbs,
    calories: calories,
  };
}

function multiplyMacro(logEntry: Entry, macro: 'protein' | 'fat' | 'carbs'): number {
  if (logEntry.portion) {
    return logEntry.multiplier * logEntry.portion.macros[macro];
  } else {
    return logEntry.multiplier * logEntry.food[macro];
  }
}
