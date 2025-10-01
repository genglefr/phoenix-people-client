import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {ComponentCanDeactivateEdit} from './ComponentCanDeactivateEdit';

@Injectable()
export class CanDeactivateEditGuard implements CanDeactivate<ComponentCanDeactivateEdit> {
  canDeactivate(component: ComponentCanDeactivateEdit): boolean {
    if (!component.canDeactivate()) {
      return confirm('Discard changes ?');
    }
    return true;
  }
}
