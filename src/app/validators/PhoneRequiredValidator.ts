import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Check
 * if the field 'computerModel' is set and has a value different from 'No laptop',
 * the keyboard should not be null or blank or equals to 'No keyboard'
 */
export function phoneRequiredValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    const phoneNumber = form.get('phoneNumber').value;
    const phoneModel = form.get('phoneModel').value;
    const phoneImei = form.get('phoneImei').value;
    let errors = null;
    if(!phoneNumber && !phoneImei) {
      errors = {
        fieldsRequired: true
      }
    }

    if((phoneImei && !phoneModel)) {
      if(errors == null) {
        errors = {}
      }
      errors.missingModel = true;
    }

    if((phoneModel && !phoneImei)) {
      if(errors == null) {
        errors = {}
      }
      errors.missingImei = true;
    }

    return errors;
  }

}
