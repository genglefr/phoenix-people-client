import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PhoneConsumptionService} from '../services/PhoneConsumption/phone-consumption.service';
import {CompanyService} from '../services/Company/company.service';
import {FilterService} from '../services/Filter/filter.service';
import { FileConsumptionImportService } from '../services/FileConsumptionImport/file-consumption-import.service';

@Injectable()
export class PhoneConsumptionResolver implements Resolve<any> {

  constructor(
    private phoneConsumptionService: PhoneConsumptionService,
    private companyService: CompanyService,
    private filterService: FilterService,
    private fileConsumptionService: FileConsumptionImportService
  ) {
  }

  /**
   * Return array of promise corresponding to needed field.
   * @param route - the route.
   * @param state - the state.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const fullName: string = route.queryParamMap.get('resource');
    if(fullName) {
      this.filterService.setPhoneConsumptionFilterDto(
        {
          phoneConsumptionStatus: null,
          resourceName: fullName,
          sortingRow: 'phoneConsumptionViewId.invoiceDate',
          ascending: false,
        }
      );
    }
    return Promise.all([
        this.phoneConsumptionService.getPhoneConsumptions(),
        this.companyService.getCompanies(),
        this.phoneConsumptionService.getStatus(),
        this.filterService.getPhoneConsumptionFilterDto(),
        this.phoneConsumptionService.getPeriods(),
        this.phoneConsumptionService.getPhoneFixedCosts(),
        this.phoneConsumptionService.getFixedCostsPeriods(),
        this.filterService.getPhoneFixedCostsFilterDto(),
        this.fileConsumptionService.getFilteredCandidates(this.filterService.getFileConsumptionFilterDto(), 25, 0),
        this.phoneConsumptionService.getCompanies()
      ]
    );
  }
}
