import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FilterService} from '../Filter/filter.service';
import {AlarmCodeDto, AlarmCodeFilterDto, PageDto} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class AlarmCodeService {

  constructor(private http: HttpClient, private filterService: FilterService) {
  }

  /**
   * Get the alarm page.
   * @param filter the filter to page on.
   * @param pageSize the page size.
   * @param pageIndex the page index.
   */
  getAlarmPage(filter: AlarmCodeFilterDto = this.filterService.getAlarmFilterDto(),
               pageSize: number = 25, pageIndex: number = 0): Promise<PageDto<AlarmCodeDto>> {
    let params = new HttpParams();
    params = params.append('pageSize', String(pageSize));
    params = params.append('pageIndex', String(pageIndex));

    return this.http.post<PageDto<AlarmCodeDto>>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ALARM_ENDPOINT}list`,
      filter,
      {params}
    ).toPromise()
      .then(result => {
        this.filterService.setAlarmFilterDto(filter);
        return Promise.resolve(result);
      });
  }

  /**
   * Create or update the alarm code.
   * @param alarmCodeDto the alarm code to create or update.
   */
  createOrUpdateAlarmCode(alarmCodeDto: AlarmCodeDto): Promise<AlarmCodeDto> {
    return this.http.post<AlarmCodeDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ALARM_ENDPOINT}`, alarmCodeDto)
      .toPromise();
  }

  /**
   * Deletes a alarm code.
   * Returns true if the alarm code exists and has been deleted, false otherwise.
   * @param alarmCodeDto the alarm code to delete.
   */
  deleteBadge(alarmCodeDto: AlarmCodeDto): Promise<boolean> {
    return this.http.delete<boolean>(`${ApiInformation.API_ENDPOINT}${ApiInformation.ALARM_ENDPOINT}${alarmCodeDto.id}`)
      .toPromise();
  }
}
