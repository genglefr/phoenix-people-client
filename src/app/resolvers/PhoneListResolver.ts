import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PhoneService } from '../services/Phone/phone.service';
import {FilterService} from "../services/Filter/filter.service";

@Injectable()
export class PhoneListResolver implements Resolve<any> {

  constructor(
    private phoneService: PhoneService,
    private filterService: FilterService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const filter = this.filterService.getPhoneFilterDto()
    return Promise.all([
     this.phoneService.getPhonePage(filter),
      Promise.resolve(filter)
  ]);
  }
}
