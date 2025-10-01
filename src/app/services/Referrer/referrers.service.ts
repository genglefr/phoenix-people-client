import {Injectable} from '@angular/core';
import {PageDto, ReferredDto, ReferredFilterDto, ShortResourceDto} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';
import {HttpClient} from '@angular/common/http';
import {Pagination} from "../../../environments/config";
import {FilterService} from "../Filter/filter.service";
import {NotificationService} from "../notification.service";

@Injectable({
  providedIn: 'root'
})
export class ReferrersService {

  constructor(private http: HttpClient,
              private filterService: FilterService,
              private notificationService: NotificationService) {
  }

  /**
   * Get all the referrers.
   */
  getReferrers(): Promise<ShortResourceDto[]> {

    return new Promise<ShortResourceDto[]>(
      (resolve, reject) => {
        this.http.get<ShortResourceDto[]>(
          `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}referrers`
        ).subscribe(
          data => resolve(data), error => reject(error)
        );
      }
    );
  }

  /**
   * Get the referred page dto filtered and paginated by the given values.
   * @param filter
   * @param pagination
   */
  getReferredPage(filter: ReferredFilterDto = {}, pagination: Pagination = new Pagination(0, 25)): Promise<PageDto<ReferredDto>> {
    return this.http.post<PageDto<ReferredDto>>(`${ApiInformation.API_ENDPOINT}${ApiInformation.REFERRAL_LIST}?${pagination.toParams()}`, filter)
      .toPromise()
      .then(res => {
        this.filterService.setReferredFilterDto(filter);
        return Promise.resolve(res);
      });
  }

  /**
   * Save the given referrer
   * @param referred
   */
  saveReferrers(referred: ReferredDto): Promise<any>{
    return this.http.put<any>(`${ApiInformation.API_ENDPOINT}${ApiInformation.REFERRAL_ENDPOINT}`, referred)
      .toPromise()
      .then(res => {
        this.notificationService.addSuccessToast(`The referrer has been updated`);
        return Promise.resolve(res);
      });
  }
}
