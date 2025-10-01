import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';
import {ResourceFilterDto} from '../model';
import {CompanyService} from '../services/Company/company.service';

@Injectable()
export class ListsResolver implements Resolve<any> {

  constructor(private resourceService: ResourceService, private companyService: CompanyService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.resourceService.getJobTypes(),
      this.companyService.getCompanies()
    ]);
  }
}
