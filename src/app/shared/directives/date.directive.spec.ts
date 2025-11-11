import { FormControl } from '@angular/forms';
import { DateValidator } from './date.directive';

describe('Directive: valid date', () => {

  it('should validate date', () => {
    const dateDirective = new DateValidator();
    let result = dateDirective.validate(new FormControl('1-1-2021'));
    expect(result).toBeNull();
    result = dateDirective.validate(new FormControl(''));
    expect(result).toBeNull();
    result = dateDirective.validate(new FormControl('32-4-2021'));
    expect(result).toEqual({ 'DateValidator': true });
  });

});
