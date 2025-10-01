import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {OnBoardingService} from '../services/OnBoarding/on-boarding.service';
import {ManagerBoardResourceDto} from '../model';
import {FilterService} from '../services/Filter/filter.service';

@Injectable()
export class OnboardeeDetailsResolver implements Resolve<any> {

  constructor(private onBoardingService: OnBoardingService,
              private filterService: FilterService) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Promise<any> | any> {
    let onboardee: ManagerBoardResourceDto;
    await this.onBoardingService.getOnboardeeDetails(route.paramMap.get('account')).then(data => {
      onboardee = data;
    });
    const filter = this.filterService.getOnboardeeStepFilterDto();
    filter.isCandidate = onboardee.isCandidate;
    filter.account = onboardee.account;
    this.filterService.setOnboardeeStepFilterDto(filter);
    return Promise.all([
      this.onBoardingService.getOnboardingSteps(this.filterService.getOnboardeeStepFilterDto()),
      this.onBoardingService.getOnboardingStepDueDates()
    ]).then(values => {
      return {
        onboardee: onboardee,
        steps: values[0],
        dueDates: values[1]
      };
    });
  }
}
