import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CandidateService} from '../services/Candidate/candidate.service';
import {OnBoardingService} from '../services/OnBoarding/on-boarding.service';

@Injectable()
export class CandidateOfferUpdateResolver implements Resolve<any> {

  constructor(private candidateService: CandidateService, private onboardingService: OnBoardingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.onboardingService.getResourceForRecruiterById(route.queryParamMap.get('srCandidateId'), route.queryParamMap.get('srJobId')),
      this.candidateService.getCandidateBySrId(route.queryParamMap.get('srCandidateId'))
    ]);
  }

}
