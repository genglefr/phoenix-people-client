import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Check if at least one email is entered in the mail modal.
 */
export const manualReminderValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const mailTo = control.get('mail-to');
  const mailCc = control.get('mail-cc');
  const mailBcc = control.get('mail-bcc');

  return mailTo.value.length === 0  && mailCc.value.length === 0 && mailBcc.value.length === 0 ? { manualReminder: true } : null;
};
