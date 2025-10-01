import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ResourceService} from "../services/Resource/resource.service";
import {Observable} from "rxjs";

@Injectable()
export class WorkingRemoteResolver implements Resolve<any> {

  constructor(private resourceService: ResourceService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.resourceService.retrieveWorkingRemoteCountries();
  }

}
