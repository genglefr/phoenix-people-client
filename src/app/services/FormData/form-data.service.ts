import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  AssetDto,
  ESecurityLevel,
  FormDataDto,
  RullingCategoryDto,
  WrapperECandidateStatusDto,
  WrapperEJobTypeDto
} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get the form data for lists/autocomplete.
   */
  getFormData(): Promise<FormDataDto> {
    return this.http.get<FormDataDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}form/data`
      ).toPromise();
  }

  /**
   * Get the form data for lists/autocomplete.
   */
  getCompaniesForRecruiters(): Promise<string[]> {
    return this.http.get<string[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RECRUITER_ENDPOINT}form/companies`
      ).toPromise();
  }

  /**
   * Get the light form data for lists/autocomplete.
   */
  getLightFormData(): Promise<FormDataDto> {
    return this.http.get<FormDataDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}form/data/light`
      ).toPromise();
  }

  /**
   * Get the titles list
   */
  getTitles(): Promise<string[]> {
    return this.http.get<string[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}form/titles`
      ).toPromise();
  }

  /**
   * Returns a promised empty form data.
   */
  buildEmptyFormData(): Promise<FormDataDto> {
    return Promise.resolve({
      customers: [],
      departments: [],
      titles: [],
      jobpositions: [],
      jobtypes: [],
      candidateStates: [],
      companies: [],
      customersContracts: [],
      partners: [],
      laptopModels: [],
      keyboardModels: [],
      operatingSystems: [],
      hardwareAssets: [],
      securityLevels: [],
      rullingCategoryDtoList: [],
    } as FormDataDto);
  }
}
