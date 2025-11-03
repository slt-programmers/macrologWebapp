import { Gender } from "../shared/model/gender"
import { calculateTDEE, clone } from "./functions"

describe('Util Functions', () => {

  it('should calculate TDEE for men', () => {
    const result = calculateTDEE(Gender.Male, 75, 175, 30);
    expect(result).toEqual(1698.75);
  });
  
  it('should calculate TDEE for women', () => {
    const result = calculateTDEE(Gender.Female, 75, 175, 30);
    expect(result).toEqual(1532.75);
  });

  it('should return array when cloning null or undefined array', () => {
    let result = clone(undefined);
    expect(result).toBeUndefined();
    result = clone(null);
    expect(result).toBeNull();
  });

  it('should clone array and make a deep clone, not a referenced clone', () => {
    const array1 = [{id: 123, someObj: {id: 234}}];
    const array2 = clone(array1);
    expect(array2).toEqual([{id: 123, someObj: {id: 234}}])
    array1[0].id = 567;
    expect(array2![0].id).toEqual(123);
    array1[0].someObj.id = 567;
    expect(array2![0].someObj.id).toEqual(234);
  });
});
