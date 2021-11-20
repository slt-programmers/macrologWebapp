import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { parse, isValid } from 'date-fns';

@Directive({
  selector: '[validDate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true }
  ]
})
export class DateValidator implements Validator {

  public validDate = true;

  validate(c: AbstractControl): { [key: string]: any } {
    const value = c.value;
    if (value !== null && value !== undefined && value !== '') {
      const date = parse(value, 'd-M-yyyy', new Date())
      if (!isValid(date)) {
        return { 'DateValidator': true };
      }
    }
    return null;
  }
}
