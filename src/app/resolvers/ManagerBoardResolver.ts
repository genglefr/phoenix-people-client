import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OnBoardingService} from '../services/OnBoarding/on-boarding.service';
import {FilterService} from '../services/Filter/filter.service';
import {ResourceService} from '../services/Resource/resource.service';

@Injectable()
export class ManagerBoardResolver implements Resolve<any> {

  constructor(private onBoardingService: OnBoardingService,
              private resourceService: ResourceService,
              private filterService: FilterService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.onBoardingService.getResourceForManagerBoard(this.filterService.getManagerBoardFilterDto()),
      this.resourceService.getJobTypes()
    ]);
  }
}
