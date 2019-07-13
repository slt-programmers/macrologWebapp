import { Directive, forwardRef, Injectable, Renderer, ElementRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import * as moment from 'moment';

@Directive({
	selector: '[validdate]',
  providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateValidator), multi: true }
    ]
})
export class DateValidator implements Validator {

private nativeElement: Node;

  public validDate = true;
	constructor(private renderer: Renderer,
							private element: ElementRef) {
		this.nativeElement = element.nativeElement;
	}

  ngOnInit() {
  }

  validate(c: AbstractControl): { [key: string]: any } {
    let v = c.value;

    if (v!= null && v != undefined && v!= "") {
      var date = moment(v, 'D-M-YYYY', true);
      if (!date.isValid()){
        return { "DateValidator": true };
      }
    }

    return null;
  }
}
