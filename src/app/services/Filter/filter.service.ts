import {Injectable} from '@angular/core';
import {
  AdministrationCandidateFilterDto,
  AdministrationResourceFilterDto,
  AlarmCodeFilterDto,
  BadgeFilterDto,
  ManagerBoardFilterDto,
  OnboardingStepFilterDto,
  RecruiterCandidateFilterDto,
  ResourceFilterDto,
  SRBoardFilterDto,
  PhoneConsumptionFilterDto,
  PhoneFixedCostFilterDto,
  PhoneFilterDto,
  ReferredFilterDto,
  FileConsumptionImportFilterDto,
  PartnerFilterDto
} from '../../model';
import {LocalStorageUtils} from '../../utils/LocalStorageUtils';
import {UserService} from '../User/user.service';
import {ECompanyMapping} from '../../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private readonly MANAGE_RESOURCES = 'managerResources';
  private readonly MANAGE_CANDIDATES = 'managerCandidates';
  private readonly FILE_CONSUMPTION = 'fileConsumption';
  private readonly WHO_IS_WHO = 'whoIsWho';
  private readonly PHONE_CONSUMPTION = 'phoneConsumption';
  private readonly PHONE_FIXED_COST = 'phoneFixedCost';
  private readonly SR_BOARD = 'srBoard';
  private readonly MANAGER_BOARD = 'managerBoard';
  private readonly RECRUITER_BOARD = 'recruiterBoard';
  private readonly ONBOARDEE_STEP = 'onboardeeStep';
  private readonly BADGE = 'badge';
  private readonly PHONE = 'phone';
  private readonly REFERRED = 'referred';
  private readonly ALARM = 'alarm';
  private readonly PARTNERS = 'partners';

  constructor(private userService: UserService) {
  }

  /**
   * set Resource filter dto
   * @param filter filter dto to set
   */
  setWhoIsWhoFilterDto(filter: ResourceFilterDto) {
    LocalStorageUtils.setWithExpiry(this.WHO_IS_WHO, JSON.stringify(filter));
  }

  /**
   *return ResourceFilterDto filter dto
   */
  getWhoIsWhoFilterDto(): ResourceFilterDto {
    const filter: ResourceFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.WHO_IS_WHO));
    return filter ? filter : {
      companies: [],
      sortingRow: 'firstName',
      ascending: true,
    };
  }

  /**
   * Return resourceFilterDto as a promise
   */
  getWhoIsWhoFilterDto$(): Promise<ResourceFilterDto> {
    const filter: ResourceFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.WHO_IS_WHO));
    if (filter) {
      return Promise.resolve(filter);
    } else {
      return this.userService.getUserPreferences$().map(res => {
          return {
            companies: res.companyDto ? res.companyDto.map(company => company.company) : [],
            sortingRow: 'firstName',
            ascending: true,
          };
      }).toPromise();
    }
  }

  /**
   * Sets the badge filter in the local storage.
   * @param filter the filter to set.
   */
  setBadgeFilterDto(filter: BadgeFilterDto) {
    LocalStorageUtils.setWithExpiry(this.BADGE, filter);
  }

  /**
   * Retrieve the badge filter by the localstorage, else construct a new one.
   */
  getBadgeFilterDto(): BadgeFilterDto {
    const filter: BadgeFilterDto = LocalStorageUtils.getWithExpiry(this.BADGE);
    return filter ? filter : {
      accessTypes: [],
      badgeNumber: null,
      ascending: true,
      sortingRow: 'number'
    } as BadgeFilterDto;
  }

  /**
   * Sets the badge filter in the local storage.
   * @param filter the filter to set.
   */
  setAlarmFilterDto(filter: AlarmCodeFilterDto) {
    LocalStorageUtils.setWithExpiry(this.ALARM, filter);
  }

  /**
   * Retrieve the badge filter by the localstorage, else construct a new one.
   */
  getAlarmFilterDto(): AlarmCodeFilterDto {
    const filter: AlarmCodeFilterDto = LocalStorageUtils.getWithExpiry(this.ALARM);
    return filter ? filter : {
      ascending: true,
      sortingRow: 'floor'
    } as AlarmCodeFilterDto;
  }

    /**
   * Sets the phone filter in the local storage.
   * @param filter the filter to set.
   */
     setPhoneFilterDto(filter: PhoneFilterDto) {
      LocalStorageUtils.setWithExpiry(this.PHONE, filter);
    }

    /**
   * Retrieve the phone filter by the localstorage, else construct a new one.
   */
     getPhoneFilterDto(): PhoneFilterDto {
      const filter: PhoneFilterDto = LocalStorageUtils.getWithExpiry(this.PHONE);
      return filter ? filter : {
        model: null,
        owner: null ,
        phoneNumber: null,
        phoneImei: null,
        serialNumber: null,
        receptionDate: null,
        ascending: true,
        sortingRow: 'name'
      } as PhoneFilterDto;
    }

  /**
   * set AdministrationResource filter dto
   * @param filter filter dto to set
   */
  setManageResourceFilterDto(filter: AdministrationResourceFilterDto) {
    LocalStorageUtils.setWithExpiry(this.MANAGE_RESOURCES, JSON.stringify(filter));
  }

  /**
   *return AdministrationResourceFilterDto filter dto
   */
  getManageResourceFilterDto(): AdministrationResourceFilterDto {
    const filter: AdministrationResourceFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.MANAGE_RESOURCES));
    return filter ? filter : {
      companies: [],
      types: [],
      sortingRow: 'startDate',
      ascending: false,
      activity: 'active'
    };
  }

  /**
   * return AdministrationResourceFilterDto filter dto as a promise
   */
  getManageResourceFilterDto$(): Promise<AdministrationResourceFilterDto> {
    const filter: AdministrationResourceFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.MANAGE_RESOURCES));
    if (filter) {
      return Promise.resolve(filter);
    } else {
      return this.userService.getUserPreferences().then(res => {
          return {
            companies: res.companyDto ? res.companyDto.map(company => company.company) : [],
            types: [],
            sortingRow: 'startDate',
            ascending: false,
            activity: 'active'
          };
      });
    }
  }

  /**
   * set AdministrationCandidateFilterDto filter dto
   * @param filter filter dto to set
   */
  setManageCandidateFilterDto(filter: AdministrationCandidateFilterDto) {
    LocalStorageUtils.setWithExpiry(this.MANAGE_CANDIDATES, JSON.stringify(filter));
  }

  /**
   * set FileConsumptionImportFilterDto filter dto
   * @param filter filter dto to set
   */
  setFileConsumptionFilterDto(filter: FileConsumptionImportFilterDto) {
    LocalStorageUtils.setWithExpiry(this.FILE_CONSUMPTION, JSON.stringify(filter));
  }


  /**
   *return AdministrationCandidateFilterDto filter dto
   */
  getManageCandidateFilterDto(): AdministrationCandidateFilterDto {
    const filter: AdministrationCandidateFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.MANAGE_CANDIDATES));
    return filter ? filter : {
      companies: [],
      types: [],
      status: ['NO_STATUS', 'PROPAL_SENT', 'PROPAL_ACCEPTED', 'CONTRACT_DONE',
        'CONTRACT_SIGNED', 'WAITING_WORK_PERMIT', 'RECEIVED_WORK_PERMIT', 'WAITING_BLUE_CARD',
        'RECEIVED_BLUE_CARD'],
      laptops: [],
      keyboards: [],
      sortingRow: 'startDate',
      ascending: true
    };
  }

  /**
   * return a FileConsumptionFilter
   */
  getFileConsumptionFilterDto(): FileConsumptionImportFilterDto {
    const filter: FileConsumptionImportFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.FILE_CONSUMPTION));
    return filter ? filter : {
      fileConsumptionId: null,
      createdOn: '',
      fileName: '',
      finishedOn: '',
      status: '',
      sortingRow: 'createdOn',
      ascending: false
    }
  }

  /**
   * return the default FileConsumptionFilter
   */
  getDefaultFileConsumptionFilterDto(): FileConsumptionImportFilterDto {
    return {
      fileConsumptionId: null,
      createdOn: '',
      fileName: '',
      finishedOn: '',
      status: '',
      sortingRow: 'createdOn',
      ascending: false
    }
  }

  /**
   * return AdministrationCandidateFilterDto filter dto as an Observalbe
   */
  getManageCandidateFilterDto$(): Promise<AdministrationCandidateFilterDto> {
    const filter: AdministrationCandidateFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.MANAGE_CANDIDATES));
    if (filter) {
      return Promise.resolve(filter);
    } else {
      return this.userService.getUserPreferences().then(res => {
          return {
            companies: res.companyDto ? res.companyDto.map(company => company.company) : [],
            types: [],
            status: ['NO_STATUS', 'PROPAL_SENT', 'PROPAL_ACCEPTED', 'CONTRACT_DONE',
              'CONTRACT_SIGNED', 'WAITING_WORK_PERMIT', 'RECEIVED_WORK_PERMIT', 'WAITING_BLUE_CARD',
              'RECEIVED_BLUE_CARD'],
            laptops: [],
            keyboards: [],
            sortingRow: 'startDate',
            ascending: true
          };
      });
    }
  }

  /**
   * set SRBoardFilterDto filter dto.
   * @param filter filter dto to set.
   */
  setSRBoardFilterDto(filter: SRBoardFilterDto) {
    LocalStorageUtils.setWithExpiry(this.SR_BOARD, JSON.stringify(filter));
  }

  /**
   * Return SRBoardFilterDto filter dto
   */
  getSRBoardFilterDto(): SRBoardFilterDto {
    const filter: SRBoardFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.SR_BOARD));
    return filter ? filter : {
      fullSearch: '',
      companies: [],
      hiringTeamMembers: [],
      statuses: []
    };
  }

  /**
   * Return SRBoardFilterDto filter dto as a promise
   */
  getSRBoardFilterDto$(): Promise<SRBoardFilterDto> {
    const filter: SRBoardFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.SR_BOARD));
    if (filter) {
      return Promise.resolve(filter);
    } else {
      return this.userService.getUserPreferences().then(res => {
          return  {
            fullSearch: '',
            companies: res.companyDto ? res.companyDto.map(company => ECompanyMapping[company.company]) : [],
            hiringTeamMembers: [],
            statuses: []
          };
      });
    }
  }

  /**
   * Set ManagerBoardFilterDto filter dto.
   * @param filter filter dto to set.
   */
  setManagerBoardFilterDto(filter: ManagerBoardFilterDto) {
    LocalStorageUtils.setWithExpiry(this.MANAGER_BOARD, JSON.stringify(filter));
  }

  /**
   * Return ManagerBoardFilterDto filter dto
   */
  getManagerBoardFilterDto(): ManagerBoardFilterDto {
    const filter: ManagerBoardFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.MANAGER_BOARD));
    return filter ? filter : {
      search: '',
      resourceTypes: [],
      status: 'ALL'
    };
  }

  /**
   * Set OnboardingStepFilterDto filter dto.
   * @param filter filter dto to set.
   */
  setOnboardeeStepFilterDto(filter: OnboardingStepFilterDto) {
    LocalStorageUtils.setWithExpiry(this.ONBOARDEE_STEP, JSON.stringify(filter));
  }

  /**
   * Return OnboardingStepFilterDto filter dto
   */
  getOnboardeeStepFilterDto(): OnboardingStepFilterDto {
    const filter: OnboardingStepFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.ONBOARDEE_STEP));
    return filter ? filter : {
      stepDone: 'ALL',
      ascending: true,
      stepSearch: '',
      account: '',
      dueDates: [],
      sortingRow: 'dueDate',
      isCandidate: true
    };
  }

  /**
   * Set RecruiterCandidateFilterDto filter dto.
   * @param filter filter dto to set.
   */
  setRecruiterCandidateFilterDto(filter: RecruiterCandidateFilterDto) {
    LocalStorageUtils.setWithExpiry(this.RECRUITER_BOARD, JSON.stringify(filter));
  }

  /**
   * Return RecruiterCandidateFilterDto filter dto
   */
  getRecruiterCandidateFilterDto(): RecruiterCandidateFilterDto {
    const filter: RecruiterCandidateFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.RECRUITER_BOARD));
    return filter ? filter : {
      companies: [],
      fullNameSearch: '',
      jobIds: [],
      lastRequests: [],
      requestAuthors: [],
      statusIds: [],
      ascending: true,
      sortingRow: 'candidate'
    };
  }

  /**
   * Return RecruiterCandidateFilterDto filter dto as a promise
   */
  getRecruiterCandidateFilterDto$(): Promise<RecruiterCandidateFilterDto> {
    const filter: RecruiterCandidateFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.RECRUITER_BOARD));
    if (filter) {
      return Promise.resolve(filter);
    } else {
      return this.userService.getUserPreferences().then(res => {
          return  {
            companies: res.companyDto ? res.companyDto.map(company => ECompanyMapping[company.company]) : [],
            fullNameSearch: '',
            jobIds: [],
            lastRequests: [],
            requestAuthors: [],
            statusIds: [],
            ascending: true,
            sortingRow: 'candidate'
          };
      });
    }
  }

  /**
   * set Phone consumption filter dto
   * @param filter filter dto to set
   */
  setPhoneConsumptionFilterDto(filter: PhoneConsumptionFilterDto) {
    LocalStorageUtils.setWithExpiry(this.PHONE_CONSUMPTION, JSON.stringify(filter));
  }

  /**
   *return Phone consumption filter dto
   */
  getPhoneConsumptionFilterDto(): PhoneConsumptionFilterDto {
    const filter: PhoneConsumptionFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.PHONE_CONSUMPTION));
    return filter ? filter : {
      phoneConsumptionStatus: null,
      sortingRow: 'phoneConsumptionViewId.period',
      ascending: false,
    };
  }

  /**
   * set Phone fixed costs filter dto
   * @param filter filter dto to set
   */
  setPhoneFixedCostsFilterDto(filter: PhoneConsumptionFilterDto) {
    LocalStorageUtils.setWithExpiry(this.PHONE_FIXED_COST, JSON.stringify(filter));
  }

  /**
   *return Phone consumption filter dto
   */
  getPhoneFixedCostsFilterDto(): PhoneFixedCostFilterDto {
    const filter: PhoneFixedCostFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.PHONE_FIXED_COST));
    return filter ? filter : {
      periods: [],
      companies: [],
      sortingRow: 'period',
      ascending: false,
    };
  }

  /**
   * Set the given referredFilter dto
   * @param filter filter to set
   */
  setReferredFilterDto(filter: ReferredFilterDto) {
    LocalStorageUtils.setWithExpiry(this.REFERRED, JSON.stringify(filter));
  }

  /**
   * Get the set referredFilterDto if exist otherwise get the default referredFilterDto
   */
  getReferredFilterDto(): ReferredFilterDto {
    const filter: ReferredFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.REFERRED));
    return filter ? filter : {
      ascending: true,
      status: '',
      companies: [],
      types: [],
      sortingRow: 'referredName'
    };
  }

  /**
   * Get the filter for the partner list.
   */
  getPartnerListFilter(): PartnerFilterDto {
    const filter: PartnerFilterDto = JSON.parse(LocalStorageUtils.getWithExpiry(this.PARTNERS));
    return filter ? filter : {
      sortingRow: 'legalName',
      type: null,
      ascending: true,
      active: null
    };
  }

  /**
   * Sets the partner filter.
   * @param partnerFilter the partnerFilter to set.
   */
  setPartnerFilter(partnerFilter: PartnerFilterDto) {
    LocalStorageUtils.setWithExpiry(this.PARTNERS, JSON.stringify(partnerFilter));
  }
}
