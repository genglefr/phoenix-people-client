import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {FileUtils} from '../../utils/FileUtils';

@Injectable({
  providedIn: 'root'
})
export class SanityService {

  constructor(private http: HttpClient) { }

  /**
   * Check the sanity file.
   * @param file to check.
   * @param password for the file.
   */
  checkSanityFile(file: File, password: string): Promise<void> {
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/vnd.ms-excel');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.SANITY_ENDPOINT}check`,
      formData,
      {responseType: 'blob', headers: headers}
      ).toPromise().then(data => {
        FileUtils.downloadFile(data, 'cost_file_issues.xls');
        return Promise.resolve();
      });
  }
}
