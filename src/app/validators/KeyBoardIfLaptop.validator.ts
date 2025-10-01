import { FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {StringUtils} from "../utils/StringUtils";

/**
 * Check
 * if the field 'computerModel' is set and has a value different from 'No laptop',
 * the keyboard should not be null or blank or equals to 'No keyboard'
 */
export function keyBoardIfLaptopValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    const laptop = form.get('computerModel').value;
    const keyboard = form.get('keyboardLayout').value;

    const NO_KEYBOARD = 'No keyboard';
    const NO_LAPTOP = 'No laptop';

    if ( (laptop && laptop !== NO_LAPTOP) && ( !keyboard || keyboard === NO_KEYBOARD )) {
      return {
        keyBoardIfLaptop: true
      }
    } else if (!laptop) {
      return {
        laptopRequired: true
      }
    }
    return null;
  }

}
