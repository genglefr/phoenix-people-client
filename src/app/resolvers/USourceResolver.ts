import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';
import {CompanyService} from '../services/Company/company.service';
import {FilterService} from '../services/Filter/filter.service';

@Injectable()
export class USourceResolver implements Resolve<any> {

  constructor(private resourceService: ResourceService, private companyService: CompanyService,
              private filterService: FilterService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.filterService.getWhoIsWhoFilterDto$().then(filters => {
      return Promise.all([
        this.resourceService.getResources(filters),
        this.companyService.getCompanies(),
        Promise.resolve(filters),
      ]);
    });
  }
}
