import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {FormDataService} from '../services/FormData/form-data.service';

@Injectable()
export class LightFormDataResolver implements Resolve<any> {

  constructor(private formDataService: FormDataService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.formDataService.getLightFormData();
  }

}
