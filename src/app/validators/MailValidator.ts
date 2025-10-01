import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function mailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const mailFormatMatch = /^(.+)@(\S+)$/;
    if (!!control.value && control.value !== '') {
      const mailFormatValid = mailFormatMatch.test(control.value);
      if (!mailFormatValid) {
        return {incorrectMail: true};
      }
    }
    return null;
  };
}
