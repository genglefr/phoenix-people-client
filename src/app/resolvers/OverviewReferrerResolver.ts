import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';
import {CompanyService} from '../services/Company/company.service';
import {FilterService} from '../services/Filter/filter.service';
import {ReferrersService} from "../services/Referrer/referrers.service";

@Injectable()
export class OverviewReferrerResolver implements Resolve<any> {

  constructor(
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private filterService: FilterService,
    private referrersService: ReferrersService
  ) {}

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const filter = this.filterService.getReferredFilterDto();
    return Promise.all([
      this.referrersService.getReferredPage(filter),
      this.companyService.getCompanies(),
      this.resourceService.getJobTypes(),
      Promise.resolve(filter),
    ]);
  }
}
