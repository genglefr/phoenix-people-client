import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {BadgeService} from '../services/Badge/badge.service';
import {Observable} from 'rxjs/Observable';
import {CompanyService} from '../services/Company/company.service';

@Injectable()
export class BadgeListResolver implements Resolve<any> {

  constructor(private badgeService: BadgeService, private companyService: CompanyService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return Promise.all([
      this.badgeService.getAccessTypes(),
      this.badgeService.getBadgePage(),
      this.badgeService.getBadgeResources(),
      this.companyService.getCompanies()
    ]);
  }
}
