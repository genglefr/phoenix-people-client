import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {OnBoardingService} from '../services/OnBoarding/on-boarding.service';
import {FilterService} from '../services/Filter/filter.service';

@Injectable()
export class RecruiterDashboardResolver implements Resolve<any> {

  constructor(private onBoardingService: OnBoardingService, private filterService: FilterService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.filterService.getRecruiterCandidateFilterDto$().then(filter => {
      return Promise.all([
        this.onBoardingService.getResourceForRecruiterBoard(filter),
        Promise.resolve(filter),
      ]);
    });
  }
}
