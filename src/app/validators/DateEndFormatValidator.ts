import * as moment from 'moment';
import {AbstractControl} from '@angular/forms';

/**
 * Return an error for the form if the start date is after the end date inside the form
 * @param group the form to verify
 */
export function dateEndFormat(field: AbstractControl): any {
  // use querySelector due to field.value parsedBy ngbDateParserFormatter, canno't test with this value
  // readonly value
  const end = document.querySelector('#personal-information #endDate');

  if (end) {
    const dateFormatValid = new RegExp('^(0[1-9]|[12][0-9]|3[01])[\\/\\-](0[1-9]|1[012])[\\/\\-]\\d{4}$').test(end['value']);
    const dateDefinition = moment(end['value'], 'DD MM YYYY');

    // check if DD/MM/YYYY format and If it's a valid date
    // add regex because moment transform uncomplete element ex: 01/12/200 => 01/12/0200 and considered as valid
    if (!dateFormatValid || !dateDefinition.isValid() ||
      dateDefinition.isValid() && !dateFormatValid) {
      return {format: true};
    } else {
      if (dateDefinition.diff(moment('01/01/2000', 'DD MM YYYY')) < 0) {
        return {min: true};
      }
    }
  }

  return null;
}
