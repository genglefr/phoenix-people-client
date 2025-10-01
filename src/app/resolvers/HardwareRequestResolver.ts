import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ResourceService} from '../services/Resource/resource.service';

@Injectable()
export class HardwareRequestResolver implements Resolve<any> {

  constructor(
    private resourceService: ResourceService,
  ) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.resourceService.findAllResourcesWithArhsLaptopNecessary();
  }
}
