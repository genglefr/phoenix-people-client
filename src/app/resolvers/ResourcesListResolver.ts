import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';
import {CompanyService} from '../services/Company/company.service';
import {FilterService} from '../services/Filter/filter.service';
import {UserService} from '../services/User/user.service';

@Injectable()
export class ResourcesListResolver implements Resolve<any> {

  constructor(
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private filterService: FilterService,
    private userService: UserService
  ) {}

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.filterService.getManageResourceFilterDto$().then(filter => {
      return Promise.all([
        this.resourceService.getFullResources(filter),
        this.companyService.getCompanies(),
        this.resourceService.getJobTypes(),
        Promise.resolve(filter),
        this.userService.getAuthenticatedUser()
      ]);
    });
  }
}
