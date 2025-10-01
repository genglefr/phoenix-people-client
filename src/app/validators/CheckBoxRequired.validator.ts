import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ESecurityLevel} from '../model';

/**
 * Check that at least one check box is checked
 * @param securityLevels list of checkboxs
 */
export function CheckBoxRequired(securityLevels: ESecurityLevel[]): ValidatorFn {

  return (form: FormGroup): ValidationErrors | null => {

    if (!securityLevels.some(
      securityLevel => form.get(securityLevel).value
    )) {
      return {checkBoxRequired: true};
    }

    return null;
  };

}
