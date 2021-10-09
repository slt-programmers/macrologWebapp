import { Gender } from '../shared/model/gender';

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
