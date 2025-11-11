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

export function clone<T>(array: T[] | null | undefined): T[] | null | undefined {
  if (!array) return array;
  return JSON.parse(JSON.stringify(array));
}