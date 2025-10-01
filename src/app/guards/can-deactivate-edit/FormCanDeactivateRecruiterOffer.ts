import {FormGroup} from '@angular/forms';
import {ComponentCanDeactivateEdit} from './ComponentCanDeactivateEdit';

export abstract class FormCanDeactivateRecruiterOffer extends ComponentCanDeactivateEdit {

  abstract get proposalForm(): FormGroup;

  abstract get laptopForm(): FormGroup;

  abstract get hardwareForm(): FormGroup;

  abstract get isCreateSuccess(): boolean;

  formList(): FormGroup[] {
    return [this.proposalForm, this.laptopForm, this.hardwareForm];
  }

  /**
   * Checks if is possible to leave the page without saving the changes
   */
  canDeactivate(): boolean {
    return this.proposalForm.pristine && this.laptopForm.pristine && this.hardwareForm.pristine || this.isCreateSuccess;
  }
}
