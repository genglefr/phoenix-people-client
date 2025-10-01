import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AdministrationCandidateFilterDto, CandidateDto, LaptopKeyboardDto, PageCandidateDto, PageDto } from '../../model';
import { ApiInformation } from '../../utils/ApiInformation';
import { FilterService } from '../Filter/filter.service';
import {switchMap} from 'rxjs/operators';
import {FileUtils} from '../../utils/FileUtils';
import {CompanyService} from "../Company/company.service";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  params: HttpParams;

  deleteCandidateSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private filterService: FilterService, private companyService: CompanyService) {
  }

  /**
   * Notify that a candidate as been deleted.
   */
  notifyDeleteCandidate(): void {
    this.deleteCandidateSubject.next();
  }

  /**
   * Get cropped image of the user with the corresponding account.
   * @param account The account.
   */
  getCroppedImage(account: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ApiInformation.API_ENDPOINT}ws/photo/${account}`, { responseType: 'blob' }
      ).subscribe(
        data => resolve(data), error => reject(error)
      );
    });
  }

  /**
   * Get large image of the user with the corresponding account.
   * @param account The account.
   */
  getLargeImage(account: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ApiInformation.API_ENDPOINT}ws/large/photo/${account}`, { responseType: 'blob' }
      ).subscribe(
        data => resolve(data), error => reject(error)
      );
    });
  }

  /**
   * Get full candidate corresponding to the given account.
   * @param account The account.
   */
  getCandidate(account: string): Promise<CandidateDto> {

    return new Promise((resolve, reject) => {
      this.http.get<CandidateDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}${account}`
      ).subscribe(
        data => resolve(data), error => reject(error)
      );
    });

  }

  /**
   * Check if the connected user is admin of the given account.
   * @param account The account.
   */
  getIsAdminOfCandidate(account: string): Promise<CandidateDto> {
    return this.http.get<CandidateDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}is-admin/${account ? account : ''}`
    ).toPromise();
  }

  /**
   * Get full candidate corresponding to the sr id.
   * @param srId The sr Id.
   */
  getCandidateBySrId(srId: string): Promise<CandidateDto> {
    return new Promise((resolve, reject) => {
      this.http.get<CandidateDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RECRUITER_CANDIDATES_ENDPOINT}${srId}`
      ).subscribe(
        data => resolve(data), error => reject(error)
      );
    });

  }

  /**
   * Checks if the account is already used for a resource or a candidate
   * @param account - account to check
   */
  checkIfAccountUsedInResourcesOrCandidates(account: string): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
      this.http.post(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.ACCOUNT_EXISTING_ENDPOINT}`, account
      ).subscribe(
        res => {
          resolve(res);
        },
        error => reject(error)
      );
    });
  }

  /**
   * Checks if the account is already used for a resource or a candidate
   * @param account - account to check
   */
  checkIfAccountUsedInResources(account: string): Promise<boolean> {
    return this.http.get<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ACCOUNT_EXISTING_RESOURCE_ENDPOINT_FOR_CANDIDATE}${account}`
    ).toPromise();
  }

  /**
   * Creates a new candidate
   * @param  user: candidate to create
   */
  createCandidate(user: CandidateDto) {
    return new Promise((resolve, reject) => {
      this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}create`, user)
        .subscribe(
          res => {
            resolve(res);
          },
          error => reject(error)
        );
    });
  }

  /**
   * Updates an existing candidate
   * @param user: candidate to update
   * @return the saved data
   */
  updateCandidate(user: CandidateDto): Promise<CandidateDto> {
    return new Promise((resolve, reject) => {
      this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}update`, user)
        .subscribe(
          (res: CandidateDto) => {
            resolve(res);
          },
          error => reject(error)
        );
    });
  }

  /**
   * Updates an existing candidate hardware
   * @param user: candidate to update
   * @return the saved data
   */
  updateCandidateHardware(user: CandidateDto): Promise<CandidateDto> {
    return this.http.post<CandidateDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}update/hardware`, user)
      .toPromise();
  }

  /**
   * Moves a candidate to resources
   * @param user: account to move
   */
  moveCandidate(user: string): Promise<CandidateDto> {
    return new Promise((resolve, reject) => {
      this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}move`, user)
        .subscribe(
          (res: CandidateDto) => {
            resolve(res);
          },
          error => reject(error)
        );
    });
  }

  /**
   * Deletes te candidate
   * @param account: account to delete
   */
  deleteCandidate(account: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}delete`, account)
        .subscribe(
          (res: CandidateDto) => {
            resolve(res);
          },
          error => reject(error)
        );
    });
  }

  /**
   * Returns the promise containing the list of all candidates
   */
  getCandidates(): Promise<CandidateDto[]> {
    return new Promise(resolve => {
      this.http.get<CandidateDto[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}`
      ).subscribe(
        data => resolve(data)
      );
    });
  }

  /**
   * Returns the promise containing the list of laptop related to the company
   */
  getLaptopModelsByCompany(company: string): Promise<LaptopKeyboardDto[]> {
    return new Promise(resolve => {
      this.http.get<LaptopKeyboardDto[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.LAPTOP_COMPANY_ENDPOINT}${company}`
      ).subscribe(
        data => resolve(data)
      );
    });
  }

  /**
   * Get candidates corresponding to the filter's values.
   * @param filter The filter.
   * @param pageSize The number of element to display.
   * @param pageIndex The id of the page.
   */
  getFilteredCandidates(filter: AdministrationCandidateFilterDto = this.filterService.getManageCandidateFilterDto(),
                        pageSize: number = 25,
                        pageIndex: number = 0): Promise<PageDto<PageCandidateDto>> {

    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');

    return new Promise(resolve => {
        this.http.post<PageDto<PageCandidateDto>>(
          `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}list`,
          filter,
          { params: this.params }
        ).subscribe(
          data => {
            this.filterService.setManageCandidateFilterDto(filter);
            resolve(data);
          }
        );
      }
    );
  }

  /**
   * Check if the induction responsible is available for the chosen day.
   * @param account of the induction responsible.
   * @param startDate of the candidate.
   */
  isInductionResponsibleAvailable(account: string, startDate: string): Promise<boolean> {
    return this.http.get<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}induction-responsible/availability/${account}/${startDate}`)
      .toPromise();
  }



  /**
   * Generate car policy template
   * @param candidateId candidate id
   */
  generateCarPolicyTemplate(candidateId: number) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.CANDIDATES_ENDPOINT}generate/car-policy/${candidateId}`,
      {responseType: 'blob'}
    ).pipe(switchMap(FileUtils.convertByteArrayToBlob)).toPromise();
  }

  /**
   * Check if a given candidate can be moved into a resource
   * i.e. status must be CONTRACT_SIGNED, a company must be selected.
   * @param status candidate status
   * @param residentialCountry candidate residential country
   * @param company candidate company
   * @param start candidate start date
   * @param hardwareRequired hardware required
   * @param hardware selected laptop
   * @param layout selected keyboard layout
   */
  public canBeMoved(status, company, start, hardwareRequired, hardware, layout): boolean {
    return status === 'CONTRACT_SIGNED' && company
      && start
      && (!hardwareRequired || (hardwareRequired && hardware && layout));
  }
}
