import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {CandidateService} from '../services/Candidate/candidate.service';
import {FilterService} from '../services/Filter/filter.service';

@Injectable()
export class CandidatesListResolver implements Resolve<any> {

  constructor(private candidateService: CandidateService, private filterService: FilterService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.filterService.getManageCandidateFilterDto$().then(filter => {
      return Promise.all([this.candidateService.getFilteredCandidates(filter), Promise.resolve(filter)]);
    });
  }

}
