import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FilterService } from '../Filter/filter.service';
import {
  AdministrationCandidateFilterDto, FileConsumptionImportDto,
  FileConsumptionImportFilterDto,
  PageCandidateDto,
  PageDto
} from '../../model';
import { ApiInformation } from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class FileConsumptionImportService {

  params: HttpParams;

  constructor(private http: HttpClient, private filterService: FilterService) {
  }

  /**
   * Get candidates corresponding to the filter's values.
   * @param filter The filter.
   * @param pageSize The number of element to display.
   * @param pageIndex The id of the page.
   */
  public getFilteredCandidates(filter: FileConsumptionImportFilterDto = this.filterService.getFileConsumptionFilterDto(),
                        pageSize: number = 25,
                        pageIndex: number = 0): Promise<PageDto<FileConsumptionImportDto>> {

    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');

    return new Promise(resolve => {
        this.http.post<PageDto<FileConsumptionImportDto>>(
          `${ApiInformation.API_ENDPOINT}fileConsumptionImport/list`,
          filter,
          { params: this.params }
        ).subscribe(
          data => {
            this.filterService.setFileConsumptionFilterDto(filter);
            resolve(data);
          }
        );
      }
    );
  }

}
