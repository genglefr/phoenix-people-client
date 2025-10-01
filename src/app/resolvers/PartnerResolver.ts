import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ResourceService} from '../services/Resource/resource.service';
import {PartnerService} from '../services/Partner/partner.service';

@Injectable()
export class PartnerResolver implements Resolve<any> {

  constructor(private resourceService: ResourceService,
              private partnerService: PartnerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const legalName = route.paramMap.get('id');
    return Promise.all([
      this.resourceService.retrieveCountries(),
      this.partnerService.getPartnerByLegalName(legalName)
    ]).then(([countries, partner]) => ({
      countries,
      partner
    }));
  }
}
