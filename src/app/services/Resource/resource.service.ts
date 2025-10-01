import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiInformation} from '../../utils/ApiInformation';
import {
  AdministrationResourceFilterDto, CandidateDto,
  CountryDto,
  FullResourceDto,
  HardwareRequestResourceDto,
  PageDto,
  PageResourceDto,
  ResourceFilterDto,
  ResourceFullNameAndAccountDto,
  WhoIsWhoResourceDto, WorkingRemoteDto,
  WrapperEJobTypeDto
} from '../../model';
import {Observable, of, Subject} from 'rxjs';
import {FilterService} from '../Filter/filter.service';
import {switchMap} from 'rxjs/operators';
import {CacheService} from "../cache.service";
import {FileUtils} from '../../utils/FileUtils';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  params: HttpParams;

  updateSubject: Subject<any> = new Subject<any>();
  forceCreateSubject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient, private filterService: FilterService, private cache: CacheService) {
  }

  /**
   * Notify force create
   */
  notifyForceCreate() {
    this.forceCreateSubject.next();
  }

  /**
   * Notify update subject
   */
  notifyUpdateSubject(data: any) {
    this.updateSubject.next(data);
  }

  /**
   * Get cropped image of the user with the corresponding account.
   * This service is used to bypass the security measures of the public webservice so the user can access his own
   * picture event if he didn't wanted to make it public.
   * @param account The account.
   */
  getCroppedImage(account: string): Promise<Blob> {
    return this.http.get(
        `${ApiInformation.API_ENDPOINT}administration/photo/${account}`, {responseType: 'blob'}
    ).toPromise();
  }

  /**
   * Get cropped image of the user with the corresponding account.
   * This service is used to bypass the security measures of the public webservice so the user can access his own
   * picture event if he didn't wanted to make it public.
   * @param account The account.
   */
  getEvokoPin(account: string, update: boolean): Observable<string> {
    const options: Object = {responseType: 'text'};
    return this.http.post<string>(`${ApiInformation.API_ENDPOINT}evoko/pin`, {
      account: account,
      update: update
    }, options);
  }

  /**
   * Get large image of the user with the corresponding account.
   * This service is used to bypass the security measures of the public webservice so the user can access his own
   * picture event if he didn't wanted to make it public.
   * @param account The account.
   */
  getLargeImage(account: string): Promise<Blob> {
    return this.http.get(
        `${ApiInformation.API_ENDPOINT}administration/large/photo/${account}`, {responseType: 'blob'}
    ).toPromise();
  }

  /**
   * Get full resource corresponding to the given account.
   * @param account The account.
   */
  getResource(account: string): Promise<FullResourceDto> {
    return this.http.get<FullResourceDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}${account}`
    ).toPromise();

  }

  /**
   * Returns the current user connected to the application
   */
  getConnectedResource(): Promise<FullResourceDto> {
    return this.http.get<FullResourceDto>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.PROFILE_ENDPOINT}`
    ).toPromise();
  }

  /**
   * Get light resources (excludes Consortium, Profile and PTM).
   * @param filter The filter.
   * @param pageSize The page size.
   * @param pageIndex The page index.
   */
  getResources(filter: ResourceFilterDto = this.filterService.getWhoIsWhoFilterDto(),
               pageSize: number = 25,
               pageIndex: number = 0): Promise<PageDto<WhoIsWhoResourceDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');
    return this.http.post<PageDto<WhoIsWhoResourceDto>>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.EMPLOYEE_RESOURCES_ENDPOINT}${ApiInformation.WHOISWHO_ENDPOINT}list`,
        filter,
        {params: this.params}
    ).toPromise().then(
        data => {
          this.filterService.setWhoIsWhoFilterDto(filter);
          return Promise.resolve(data);
        }
      );
  }

  /**
   * Get full resources.
   * @param filter The filter.
   * @param pageSize The page size.
   * @param pageIndex The page index.
   */
  getFullResources(filter: AdministrationResourceFilterDto = this.filterService.getManageResourceFilterDto(),
                   pageSize: number = 25,
                   pageIndex: number = 0): Promise<PageDto<PageResourceDto>> {
    this.params = new HttpParams();
    this.params = this.params.append('pageSize', pageSize + '');
    this.params = this.params.append('pageIndex', pageIndex + '');
    return this.http.post<PageDto<PageResourceDto>>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}list`,
        filter,
        {params: this.params}
    ).toPromise().then(
        data => {
          this.filterService.setManageResourceFilterDto(filter);
          return Promise.resolve(data);
        }
      );
  }

  /**
   * Find all resources
   */
  findAllWithAccountNeeded(): Promise<FullResourceDto[]> {
    return this.http.get<FullResourceDto[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}all/account-needed`,
    ).toPromise();
  }

  /**
   * Get the job types.
   */
  getJobTypes(): Promise<WrapperEJobTypeDto[]> {
    return this.http.get<WrapperEJobTypeDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.JOB_TYPE_ENDPOINT}list`).toPromise();
  }

  /**
   * Save the large picture on server.
   * @param largePicture The large picture.
   * @param fileName The file name.
   * @param account The account.
   */
  saveLargePicture(largePicture: any, fileName: string, account: string) {
    this.params = new HttpParams();
    this.params = this.params.append('account', account);
    this.params = this.params.append('filename', fileName);
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}picture/original/save`,
      largePicture,
      {params: this.params}
      ).toPromise();
  }

  /**
   * Save the cropped picture on server.
   * @param croppedPicture The cropped picture.
   * @param fileName The file name.
   * @param account The account.
   */
  saveCroppedPicture(croppedPicture: any, fileName: string, account: string) {
    this.params = new HttpParams();
    this.params = this.params.append('account', account);
    this.params = this.params.append('filename', fileName);
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}picture/cropped/save`,
      croppedPicture,
      {params: this.params}
      ).toPromise();
  }

  /**
   * Save the large and the cropped picture in the server.
   * @param largePicture    The large picture in base64.
   * @param croppedPicture  The cropped picture in base64.
   * @param account         The account to which belong the images.
   * @param fileName        The file name.
   */
  savePictures(largePicture: any, croppedPicture: any, account: string, fileName: string) {
    return this.saveLargePicture(largePicture, 'large.jpg', account).then(large => {
      return this.saveCroppedPicture(croppedPicture, 'cropped.jpg', account).then(cropped => {
        return {
          largePicture: large,
          croppedPicture: cropped
        };
      });
    });
  }

  /**
   * Creates a new resource
   * @param  user: resource to create
   */
  createResource(user: FullResourceDto) {
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}create`,
      user
    ).toPromise();
  }

  /**
   * Creates a new resource
   * @param  user: resource to create
   */
  forceCreateResource(user: FullResourceDto) {
    return this.http.post(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}create/force`,
      user
    ).toPromise();
  }

  /**
   * Creates a new resource in holaris adn timesheet
   * @param  account: resource to add
   */
  addToTimesheetAndHolaris(account: string) {
    return Promise.all([
      this.addToHolaris(account),
      this.addToTimesheet(account)
    ]);
  }

  /**
   * Creates a new resource in holaris
   * @param  account: resource to add to holaris
   */
  addToHolaris(account: string) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.HOLARIS_ENDPOINT}cache/refresh/${account}`
    ).toPromise();
  }

  /**
   * Creates a new resource in timesheet
   * @param  account: resource to add to timesheet
   */
  addToTimesheet(account: string) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.TIMESHEET_ENDPOINT}cache/refresh/${account}`
    ).toPromise();
  }

  /**
   * Updates an existing resource
   * @param user: resource to update
   * @return the saved data
   */
  updateResource(user: FullResourceDto): Promise<FullResourceDto> {
    return this.http.post<FullResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}update`,
      user
    ).toPromise();
  }

  /**
   * Updates an existing resource
   * @param user: resource to update
   * @return the saved data
   */
  updateResourceAndDeleteInHolaris(user: FullResourceDto): Promise<FullResourceDto> {
    return this.http.post<FullResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}update/holaris`,
      user
    ).toPromise();
  }

  /**
   * Updates my details
   * @param user: information about me to update
   * @return the saved data
   */
  updateMyDetails(user: FullResourceDto): Promise<FullResourceDto> {
    return this.http.post<FullResourceDto>(`${ApiInformation.API_ENDPOINT}${ApiInformation.EMPLOYEE_RESOURCES_ENDPOINT}update`, user)
      .toPromise();
  }

  /**
   * Create new contract for current user
   * @param user: resource that belongs to the new contract
   */
  newContract(user: FullResourceDto): Promise<FullResourceDto> {
    return this.http.post<FullResourceDto>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}new-contract`,
      user
    ).toPromise();
  }

  /**
   * Retrieve the list of available countries.
   */
  retrieveCountries(): Promise<CountryDto[]> {
    return this.http.get<CountryDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.COUNTRIES_ENDPOINT}`).toPromise();
  }

  /**
   * Retrieves all working remote countries from database
   */
  retrieveWorkingRemoteCountries() : Promise<WorkingRemoteDto[]> {
    return this.http.get<WorkingRemoteDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.REMOTE_ENDPOINT}`).toPromise();
  }

  /**
   * Find all resources with Arhs laptop necessary flag set to true
   */
  findAllResourcesWithArhsLaptopNecessary(): Promise<HardwareRequestResourceDto[]> {
    return this.http.get<HardwareRequestResourceDto[]>(`${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}laptop-necessary`)
      .toPromise();
  }

  /**
   * Create a ticket with hardware information
   * @param hardwareRequestResourceDto: resource with hardware information
   * @return success boolean true / false
   */
  createTicketForAccountCreation(hardwareRequestResourceDto: HardwareRequestResourceDto): Promise<boolean> {
    return this.http.post<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}hardware-request`,
      hardwareRequestResourceDto
    )
      .toPromise();
  }

  /**
   * Checks if the account is already used for a resource or a candidate
   * @param account - account to check
   * @param id - id to check
   */
  checkIfAccountUsedInResources(account: string, id: number): Promise<boolean> {
    return this.http.get<boolean>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.ACCOUNT_EXISTING_RESOURCE_ENDPOINT_FOR_RESOURCE}${account}/${id ? id : ''}`
    ).toPromise();
  }

  /**
   * Get all the fullName-account.
   */
  getAllResourcesFullNameAccount(): Promise<ResourceFullNameAndAccountDto[]> {
    return this.http.get<ResourceFullNameAndAccountDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}fullName-account`
    ).toPromise();
  }

  /**
   * Get all the fullName-account.
   */
  getAllResources(): Promise<ResourceFullNameAndAccountDto[]> {
    return this.cache.get<ResourceFullNameAndAccountDto[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}fullName-account/all`
    ).toPromise();
  }

  /**
   * Find an employee by its account from the chosen list.
   * @param employeeList - list of employee.
   * @param account - account to find.
   */
  findEmployeeInListByAccount(employeeList: ResourceFullNameAndAccountDto[], account: string): ResourceFullNameAndAccountDto {
    return employeeList.find(elt => elt.account === account);
  }

  /**
   * Generate template
   * @param templateName template name
   * @param resourceId resource id
   * @param historised is resource historised
   */
  generateWorkingCertificateTemplate(templateName: string, resourceId: number, historised: boolean = false) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}generate/working-certificate/${resourceId}/${templateName}/${historised}`,
      {responseType: 'blob'}
    ).pipe(switchMap(FileUtils.convertByteArrayToBlob)).toPromise();
  }

  /**
   * Generate car policy template
   * @param historised is resource historised
   * @param resourceId resource id
   */
  generateCarPolicyTemplate(resourceId: number, historised: boolean = false) {
    return this.http.get(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}generate/car-policy/${resourceId}/${historised}`,
      {responseType: 'blob'}
    ).pipe(switchMap(FileUtils.convertByteArrayToBlob)).toPromise();
  }

  /**
   * Get list of templates
   */
  getTemplateList(): Promise<string[]> {
    return this.http.get<string[]>(
      `${ApiInformation.API_ENDPOINT}${ApiInformation.RESOURCES_ENDPOINT}templates/working-certificate`
    ).toPromise();
  }
}
