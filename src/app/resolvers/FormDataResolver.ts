import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {FormDataService} from '../services/FormData/form-data.service';
import {UserService} from '../services/User/user.service';

@Injectable()
export class FormDataResolver implements Resolve<any> {

  constructor(private formDataService: FormDataService,
              private userService: UserService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.formDataService.getFormData();
  }

}
