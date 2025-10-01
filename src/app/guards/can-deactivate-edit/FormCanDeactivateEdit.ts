import {FormGroup} from '@angular/forms';
import {ComponentCanDeactivateEdit} from './ComponentCanDeactivateEdit';
import {BadgeDto} from '../../model';

export abstract class FormCanDeactivateEdit extends ComponentCanDeactivateEdit {
  abstract get informationForm(): FormGroup;

  abstract get contractDetailsForm(): FormGroup;

  abstract get customerAndContractInformationForm(): FormGroup;

  abstract get personalUsagePolicyForm(): FormGroup;

  abstract get contactForm(): FormGroup;

  abstract get emergencyContactForm(): FormGroup;

  abstract get responsibleForm(): FormGroup;

  abstract get badgeForm(): FormGroup;

  abstract get isCreateSuccess(): boolean;

  abstract get hasBadgeBeenChanged(): boolean;

  abstract get badgesToBeDeleted(): BadgeDto[];

  formList(): FormGroup[] {
    return [this.informationForm, this.contractDetailsForm, this.customerAndContractInformationForm,
      this.personalUsagePolicyForm, this.contactForm, this.emergencyContactForm, this.responsibleForm];
  }

  canDeactivate(): boolean {
    return this.informationForm.pristine && this.contractDetailsForm.pristine && this.customerAndContractInformationForm.pristine
      && this.personalUsagePolicyForm.pristine && this.contactForm.pristine && this.emergencyContactForm.pristine &&
      this.responsibleForm.pristine && this.badgeForm.pristine && !this.hasBadgeBeenChanged && this.badgesToBeDeleted.length === 0
      || this.isCreateSuccess;
  }
}
