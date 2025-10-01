import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FilterService} from '../Filter/filter.service';
import {
  BadgeDto,
  BadgeFilterDto,
  BadgeHistoryDto,
  BadgeHistoryFilterDto,
  PageDto,
  ResourceFullNameAndAccountDto
} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  constructor(private http: HttpClient, private filterService: FilterService) {
  }

  /**
   * Get the Badge page.
   * @param filter the filter to page on.
   * @param pageSize the page size.
   * @param pageIndex the page index.
   */
  getBadgePage(filter: BadgeFilterDto = this.filterService.getBadgeFilterDto(),
               pageSize: number = 25, pageIndex: number = 0): Promise<PageDto<BadgeDto>> {
    let params = new HttpParams();
    params = params.append('pageSize', String(pageSize));
    params = params.append('pageIndex', String(pageIndex));

    return this.http.post<PageDto<BadgeDto>>(
      `${ApiInformation.API_ENDPOINT}badge/list`,
      filter,
      {params}
    ).toPromise()
      .then(result => {
        this.filterService.setBadgeFilterDto(filter);
        return Promise.resolve(result);
      });
  }

  /**
   * Retrieve the badge history page.
   * @param filter the filter to apply.
   */
  getBadgeHistoryPage(filter: BadgeHistoryFilterDto): Promise<
    PageDto<BadgeHistoryDto>> {
    return this.http.post<PageDto<BadgeHistoryDto>>(`${ApiInformation.API_ENDPOINT}badge/history/list`,
      filter
      ).toPromise();
  }

  /**
   * Create or update the badge.
   * @param badge the badge to create or update.
   */
  createOrUpdateBadge(badge: BadgeDto): Promise<BadgeDto> {
    return this.http.post<BadgeDto>(`${ApiInformation.API_ENDPOINT}badge`, badge)
      .toPromise();
  }

  /**
   * Retrieve the access types.
   */
  getAccessTypes(): Promise<string[]> {
    return this.http.get<string[]>(`${ApiInformation.API_ENDPOINT}badge/accessTypes`)
      .toPromise();
  }

  /**
   * Retrieve the badge resources.
   */
  getBadgeResources(): Promise<ResourceFullNameAndAccountDto[]> {
    return this.http.get<ResourceFullNameAndAccountDto[]>(`${ApiInformation.API_ENDPOINT}badge/resources`)
      .toPromise();
  }

  /**
   * Deletes a badge.
   * Returns true if the badge exists and has been deleted, false otherwise.
   * @param badge the badge to delete.
   */
  deleteBadge(badge: BadgeDto): Promise<boolean> {
    return this.http.post<boolean>(`${ApiInformation.API_ENDPOINT}badge/delete`, badge.id)
      .toPromise();
  }

  /**
   * Retrieve the available numbers.
   */
  getAvailableNumbers(): Promise<BadgeDto[]> {
    return this.http.get<BadgeDto[]>(`${ApiInformation.API_ENDPOINT}badge/availableNumbers`)
      .toPromise();
  }
}
