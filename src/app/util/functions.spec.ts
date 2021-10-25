import { Gender } from "../shared/model/gender"
import { calculateTDEE } from "./functions"

describe('Util Functions', () => {

  it('should calculate TDEE for men', () => {
    const result = calculateTDEE(Gender.Male, 75, 175, 30);
    expect(result).toEqual(1698.75);
  });
  
  it('should calculate TDEE for women', () => {
    const result = calculateTDEE(Gender.Female, 75, 175, 30);
    expect(result).toEqual(1532.75);
  });

});
