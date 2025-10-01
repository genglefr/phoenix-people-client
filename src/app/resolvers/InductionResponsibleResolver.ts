import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';
import {CandidateService} from '../services/Candidate/candidate.service';
import {StringUtils} from '../utils/StringUtils';

@Injectable()
export class InductionResponsibleResolver implements Resolve<any> {

  constructor(private candidateService: CandidateService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.candidateService.getCandidate(route.paramMap.get('account')).then(res => {
      if (res.startDate && res.inductionResponsible) {
        // @ts-ignore
        return this.candidateService.isInductionResponsibleAvailable(res.inductionResponsible, res.startDate.replaceAll('/', '-'));
      } else {
        return true;
      }
    });
  }

}
