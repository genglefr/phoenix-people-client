import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {
  CompanyDto,
  EPhoneConsumptionStatus,
  PageDto,
  PhoneConsumptionDto,
  PhoneConsumptionFilterDto, PhoneFixedCostDto,
  PhoneFixedCostFilterDto
} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';
import {FilterService} from '../Filter/filter.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhoneConsumptionService {
  params: HttpParams;

  constructor(private http: HttpClient, private filterService: FilterService) { }

  /**
   * Get phone consumption page
   * @param filter The filter.
   * @param pageSize The page size.
   * @param pageIndex The page index.
   */
  getPhoneConsumptions(filter: PhoneConsumptionFilterDto = this.filterService.getPhoneConsumptionFilterDto(),
               pageSize: number = 25,
               pageIndex: number = 0): Promise<PageDto<PhoneConsumptionDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', `${pageSize}`);
    this.params = this.params.append('pageIndex', `${pageIndex}`);
    return this.http.post<PageDto<PhoneConsumptionDto>>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}list`,
      filter,
      {params: this.params}
    ).toPromise().then(
      data => {
        this.filterService.setPhoneConsumptionFilterDto(filter);
        return Promise.resolve(data);
      }
    );
  }

  /**
   * Get status list for phone consumption
   */
  getStatus(): Promise<EPhoneConsumptionStatus[]> {
    return this.http.get<EPhoneConsumptionStatus[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}status`,
    ).toPromise();
  }

  /**
   * Get period list for phone consumption
   */
  getPeriods(): Promise<string[]> {
    return this.http.get<string[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}periods`,
    ).toPromise();
  }

  /**
   * Upload files to parse to generate data
   * @param fileList files to parse
   */
  uploadFiles(fileList: FileList): Observable<boolean> {
    let url = `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}import`;
    const formData = new FormData();
    for (let i = 0; i < fileList.length; ++i) {
      formData.append('files', fileList[i]);
    }

    return this.http.post<boolean>(url, formData);
  }



  /**
   * Get period list for phone consumption
   */
  isLinked(resourcePhoneId: number): Promise<boolean> {
    if(!resourcePhoneId) {
      return Promise.resolve(false);
    }
    return this.http.get<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}isLinked/${resourcePhoneId}`,
    ).toPromise();
  }

  /**
   * Refresh costs
   */
  refreshCosts(filterDto: PhoneConsumptionFilterDto): Promise<any> {
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}refresh`,
      filterDto
    ).toPromise();
  }

  /**
   * Get phone consumption page
   * @param filter The filter.
   * @param pageSize The page size.
   * @param pageIndex The page index.
   */
  getPhoneFixedCosts(filter: PhoneFixedCostFilterDto = this.filterService.getPhoneFixedCostsFilterDto(),
                       pageSize: number = 25,
                       pageIndex: number = 0): Promise<PageDto<PhoneFixedCostDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', `${pageSize}`);
    this.params = this.params.append('pageIndex', `${pageIndex}`);
    return this.http.post<PageDto<PhoneFixedCostDto>>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}fixed-cost/list`,
      filter,
      {params: this.params}
    ).toPromise().then(
      data => {
        this.filterService.setPhoneFixedCostsFilterDto(filter);
        return Promise.resolve(data);
      }
    );
  }



  /**
   * Get period list for phone consumption
   */
  getFixedCostsPeriods(): Promise<string[]> {
    return this.http.get<string[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}fixed-cost/periods`,
    ).toPromise();
  }



  /**
   * Get companies list for phone consumption
   */
  getCompanies(): Promise<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}fixed-cost/companies`,
    ).toPromise();
  }

  /**
   * Save fixed cost
   * @param phoneFixedCostDto saved
   */
  saveFixedCost(phoneFixedCostDto: PhoneFixedCostDto) {
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}fixed-cost`,
      phoneFixedCostDto
    ).toPromise();
  }

  /**
   * Delete fixed cost id
   * @param phoneFixedCostId phone fixed cost id
   */
  deleteFixedCost(phoneFixedCostId: number) {
    return this.http.delete(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_CONSUMPTION_ENDPOINT}fixed-cost/${phoneFixedCostId}`
    ).toPromise();
  }
}
