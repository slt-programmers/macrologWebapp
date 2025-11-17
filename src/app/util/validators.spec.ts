import { FormControl, FormGroup } from "@angular/forms";
import { CustomValidators } from "./validators";

describe("CustomValidators", () => {

  it('should test equal values of controls in formgroup', () => {
    const group = new FormGroup({
      one: new FormControl(''),
      two: new FormControl('')
    }, {validators: [CustomValidators.equals('one', 'two')]});
    expect(group.valid).toBeTruthy();

    group.patchValue({one: '1', two: '2'})
    expect(group.valid).toBeFalsy();
  });
});
