import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CandidateService} from '../services/Candidate/candidate.service';

@Injectable()
export class EditCandidateResolver implements Resolve<any> {

  constructor(private candidateService: CandidateService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.candidateService.getCandidate(route.paramMap.get('account'));
  }

}
