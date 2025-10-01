import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PageDto, PhoneDto, PhoneFilterDto, PhoneOwnerDto} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';
import {FilterService} from '../Filter/filter.service';
import {Pagination} from "../../../environments/config";
import {map} from "rxjs/operators";
import {NotificationService} from "../notification.service";

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(private http: HttpClient,
              private filterService: FilterService,
              private notificationService: NotificationService) {
  }
  /**
   * Create or update the phone.
   * @param phone the phone to create or update.
   */
  save(phone: PhoneOwnerDto): Promise<PhoneOwnerDto> {
    return this.http.put<PhoneOwnerDto>(`${ApiInformation.API_ENDPOINT}phone`, phone)
      .pipe(map(val => this.notificationService.success(val, "Phone has been saved")))
      .toPromise();
  }

  /**
   * Get the Phone page.
   * @param filter the filter to page on.
   * @param pagination
   */
  getPhonePage(filter: PhoneFilterDto = {}, pagination: Pagination = new Pagination(0, 25)): Promise<PageDto<PhoneOwnerDto>> {
    return this.http.post<PageDto<PhoneOwnerDto>>(
      `${ApiInformation.API_ENDPOINT}phone/list?${pagination.toParams()}`, filter).toPromise()
      .then(result => {
        this.filterService.setPhoneFilterDto(filter);
        return Promise.resolve(result);
      });
  }

  /**
 * Deletes a phone.
 * Returns true if the phone exists and has been deleted, false otherwise.
 * @param phone the phone to delete.
 */
   deletePhone(phone: PhoneOwnerDto): Promise<any> {
    return this.http.post<any>(`${ApiInformation.API_ENDPOINT}phone/delete`, phone)
      .pipe(map(val => this.notificationService.success(val, "Phone has been deleted")))
      .toPromise();
  }

  /**
   * Get all phone models
   */
  getPhoneModelList(): Promise<string[]> {
    return this.http.get<string[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}phone-model/list`
    ).toPromise();
  }

}
