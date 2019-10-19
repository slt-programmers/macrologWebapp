import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[validDate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true }
  ]
})
export class DateValidator implements Validator {

  public validDate = true;

  constructor() {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    const value = c.value;
    if (value !== null && value !== undefined && value !== '') {
      const date = moment(value, 'D-M-YYYY', true);
      if (!date.isValid()) {
        return { 'DateValidator': true };
      }
    }
    return null;
  }
}
