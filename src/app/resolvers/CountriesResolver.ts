import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';

@Injectable()
export class CountriesResolver implements Resolve<any> {

  constructor(private resourceService: ResourceService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.resourceService.retrieveCountries();
  }

}
