import {FormGroup} from '@angular/forms';
import {ComponentCanDeactivateEdit} from './ComponentCanDeactivateEdit';
import {BadgeDto} from '../../model';

export abstract class FormCanDeactivateCandidateEdit extends ComponentCanDeactivateEdit {
  abstract get informationForm(): FormGroup;

  abstract get contractDetailsForm(): FormGroup;

  abstract get customerAndContractInformationForm(): FormGroup;

  abstract get contactForm(): FormGroup;

  abstract get isCreateSuccess(): boolean;

  abstract get laptopForm(): FormGroup;

  abstract get hardwareForm(): FormGroup;

  abstract get hasBadgeBeenChanged(): boolean;

  abstract get badgesToBeDeleted(): BadgeDto[];

  formList(): FormGroup[] {
    return [this.informationForm, this.contractDetailsForm, this.customerAndContractInformationForm, this.contactForm,
      this.laptopForm, this.hardwareForm];
  }

  /**
   * Checks if is possible to leave the page without saving the changes
   */
  canDeactivate(): boolean {
    return (this.informationForm.pristine && this.contractDetailsForm.pristine && this.customerAndContractInformationForm.pristine
      && this.contactForm.pristine && this.laptopForm.pristine && this.hardwareForm.pristine) &&
      !this.hasBadgeBeenChanged && this.badgesToBeDeleted.length === 0 || this.isCreateSuccess;
  }
}
