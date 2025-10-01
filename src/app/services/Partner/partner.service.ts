import { Injectable } from '@angular/core';
import {PageDto, PartnerDto, PartnerFilterDto, PartnerTableDto, WhoIsWhoResourceDto} from '../../model';
import {FilterService} from '../Filter/filter.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private http: HttpClient,
              private filterService: FilterService) { }

  /**
   * Retrieve the partners for the filter.
   * @param filter the filter to filter on.
   * @param pageSize the page size.
   * @param pageIndex the page index.
   */
  getPartners(filter: PartnerFilterDto = this.filterService.getPartnerListFilter(),
              pageSize: number = 25,
              pageIndex: number = 0) : Promise<PageDto<PartnerTableDto>> {
    let params = new HttpParams();
    params = params.append('pageSize', pageSize + '');
    params = params.append('pageIndex', pageIndex + '');
    return this.http.post<PageDto<PartnerTableDto>>(
      `${ApiInformation.API_ENDPOINT}partners/list`,
      filter,
      {params: params}
    ).toPromise().then(
      data => {
        this.filterService.setPartnerFilter(filter);
        return Promise.resolve(data);
      }
    );
  }

  /**
   * Get the partner by legal name.
   * @param legalName the legal name.
   */
  getPartnerByLegalName(legalName: string = null) {
    if (!legalName || !legalName.length) {
      return Promise.resolve(null);
    }
    return this.http.get<PartnerDto>(`${ApiInformation.API_ENDPOINT}partners/${legalName}`)
      .toPromise();
  }

  /**
   * Get the partner by legal name.
   * @param legalName the legal name.
   */
  getPartnerById(id: number = null) {
    if (!id) {
      return Promise.resolve(null);
    }
    return this.http.get<PartnerDto>(`${ApiInformation.API_ENDPOINT}partners/${id}`)
      .toPromise();
  }

  /**
   * Save the input partner.
   * @param partner the partner to save.
   */
  savePartner(partner: PartnerDto): Promise<PartnerDto> {
    return this.http.post<PartnerDto>(`${ApiInformation.API_ENDPOINT}partners`, partner)
      .toPromise();
  }
}
