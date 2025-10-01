import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import * as yaml from 'js-yaml';

export function yamlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!!control.value && control.value !== '') {
        try {
          yaml.load(control.value);
        } catch (e) {
          return { invalidYaml: true };
        }
    }
    return null;
  };
}
