import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OnBoardingService} from '../services/OnBoarding/on-boarding.service';

@Injectable()
export class SmartRecruiterBoardConfigResolver implements Resolve<any> {

  constructor(private onBoardingService: OnBoardingService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.onBoardingService.getSmartRecruiterCompanyNames(),
      this.onBoardingService.getSmartRecruiterStatuses(),
      this.onBoardingService.getHiringTeamMembers(),
      this.onBoardingService.getJobStatuses()
    ]);
  }
}
