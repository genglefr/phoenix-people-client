import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CandidateService} from '../services/Candidate/candidate.service';
import {FilterService} from '../services/Filter/filter.service';
import {Observable} from 'rxjs';
import {PartnerService} from '../services/Partner/partner.service';
import {PartnerFilterDto} from '../model';

@Injectable()
export class PartnerListResolver implements Resolve<any> {

  constructor(private partnerService: PartnerService, private filterService: FilterService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const filter: PartnerFilterDto = this.filterService.getPartnerListFilter();
    return Promise.all([
      filter,
      this.partnerService.getPartners(filter)
    ]);
  }

}
