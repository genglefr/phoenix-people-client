import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {AdministrationResourceFilterDto, CompanyDto, PhoneFilterDto} from '../../model';
import {FileUtils} from '../../utils/FileUtils';
import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportResourcesService {

  constructor(private http: HttpClient) { }

  /**
   * Calls the service to download the xls file
   * @param companies - list of companies selected
   * @param types - types of contract selected
   */
  export(companies: string[], types: string[]) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');
    return new Promise((resolve, reject) => {
      this.http.get(`${ApiInformation.API_ENDPOINT}${ApiInformation.EXPORT_ENDPOINT}${companies}/${types}`,
        {responseType: 'blob', headers: headers}
      ).subscribe(data => {
        FileUtils.downloadFile(data, 'HR-Tool_export.xls');
        }
      );
    });
  }

  /**
   * Export resources data
   * @param filter to apply
   */
  exportResources(filter: AdministrationResourceFilterDto) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');
    return new Promise((resolve, reject) => {
      this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.EXPORT_ENDPOINT}`,
        filter,
        {responseType: 'blob', headers: headers}
      ).subscribe(data => {
          FileUtils.downloadFile(data, 'Resource_export.xls');
        }
      );
    });
  }

  /**
   * Export phone consumption data
   * @param companyList filter to apply
   */
  exportPhoneConsumption(companyList: string[]) {
      return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.EXPORT_PHONE_CONSUMPTION_ENDPOINT}`,
        {companyList},
        {responseType: 'blob', observe: 'response'}
      ).toPromise().then((res: any) => {
          const blob = new Blob([res.body], {type: 'application/zip; charset=utf-8'});
          fileSaver.saveAs(blob, `costExtract.zip`);
          return Promise.resolve();
        });
  }

  /**
   * Export badge list
   */
  exportBelvalPlazaBadges() {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.BADGE_EXPORT_BELVAL_PLAZA_ENDPOINT}`,
        null,
        {responseType: 'blob', headers: headers}
      ).toPromise()
      .then(data => FileUtils.downloadFile(data, 'belval_plaza_badges_export.xls'));
  }

  /**
   * Export the badges by companies.
   * @param companies the companies to filter.
   */
  exportBadgesByCompanies(companies: CompanyDto[]) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');

    const isSingleCompany = companies.length === 1;
    const fileName = isSingleCompany ? 'badges_export.xls' : 'badges_export.zip';

    headers.set('Accept', isSingleCompany ? 'application/vnd.ms-excel' : 'application/zip');

    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.BADGE_EXPORT_ENDPOINT}`,
      companies,
      { responseType: 'blob', headers: headers }
    ).toPromise()
      .then(data => FileUtils.downloadFile(data, fileName));
  }

  /**
   * Export phone list
   */
  exportPhones(filter: PhoneFilterDto) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.PHONE_EXPORT_ENDPOINT}`,
      filter,
      {responseType: 'blob', headers: headers}
    ).toPromise()
      .then(data => FileUtils.downloadFile(data, 'phones_export.xls'));
  }

}
