import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {ErrorService} from '../services/Error/error.service';

@Injectable()
export class ErrorResolver implements Resolve<any> {

  constructor(private errorService: ErrorService) {

  }

  resolve() {
    return this.errorService.getError();
  }
}
