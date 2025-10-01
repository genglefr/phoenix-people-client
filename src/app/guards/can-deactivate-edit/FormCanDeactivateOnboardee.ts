import {FormGroup} from '@angular/forms';
import {ComponentCanDeactivateEdit} from './ComponentCanDeactivateEdit';

export abstract class FormCanDeactivateOnboardee extends ComponentCanDeactivateEdit {

  abstract get onboardeeForm(): FormGroup;

  abstract get responsibleForm(): FormGroup;

  abstract get isCreateSuccess(): boolean;

  formList(): FormGroup[] {
    return [this.onboardeeForm, this.responsibleForm];
  }

  canDeactivate(): boolean {
    return this.onboardeeForm.pristine && this.responsibleForm.pristine || this.isCreateSuccess;
  }
}
