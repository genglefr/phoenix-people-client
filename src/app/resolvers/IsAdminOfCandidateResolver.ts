import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CandidateService} from '../services/Candidate/candidate.service';

@Injectable()
export class IsAdminOfCandidateResolver implements Resolve<any> {

  constructor(private candidateService: CandidateService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.candidateService.getIsAdminOfCandidate(route.paramMap.get('account'));
  }

}
