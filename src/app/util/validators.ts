import {
  AbstractControl,
  FormGroup,
  ValidatorFn
} from "@angular/forms";

export class CustomValidators {
	public static equals(
		controlName1: string,
		controlName2: string
	): ValidatorFn {
		return (control: AbstractControl) => {
			const formgroup = control as FormGroup;
			const value1 = formgroup.get(controlName1)?.value;
			const value2 = formgroup.get(controlName2)?.value;
			if (value1 === value2) {
				return null;
			} else {
				return { unequalFields: true };
			}
		};
	}
}
