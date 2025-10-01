import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AdministrationCandidateFilterDto,
  FormDataDto,
  PageCandidateDto,
  PageDto,
  WrapperECandidateStatusDto,
  WrapperEJobTypeDto
} from '../../model';
import {Subject, Subscription} from 'rxjs';
import {CandidateService} from '../../services/Candidate/candidate.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {DateConvertorService} from '../../services/date-convertor.service';
import {NotificationService} from '../../services/notification.service';
import {LoadingService} from '../../services/loading.service';
import {UserService} from '../../services/User/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationModalComponent} from '../modal/confirmation-modal/confirmation-modal.component';
import {FilterService} from '../../services/Filter/filter.service';
import {isNullOrUndefined} from 'util';
import {CompanyService} from "../../services/Company/company.service";

@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.sass']
})
export class ManageCandidatesComponent implements OnInit, OnDestroy {

  /**
   * Form data.
   */
  formData: FormDataDto;
  /**
   * List of laptop models.
   */
  laptopModelsList: string[];
  /**
   * List of status.
   */
  statusList: WrapperECandidateStatusDto[];
  /**
   * List of company.
   */
  companyList: string[];
  /**
   * List of types.
   */
  typeList: WrapperEJobTypeDto[] = [];
  /**
   * List of keyboards.
   */
  keyboardList: string[];
  /**
   * The page index.
   */
  pageIndex = 0;
  /**
   * The number of items to show on the page.
   */
  pageSize = 25;
  /**
   * The candidates in the page.
   */
  candidates: PageDto<PageCandidateDto>;
  /**
   * The filter for the start date.
   */
  candidateFilterStartDate: any;
  /**
   * The filter for 'new graduate'.
   */
  candidateFilterNewGraduate: any = 'all';
  /**
   * If the user is admin.
   */
  isUserAdministrator: boolean;

  selectAll = false;
  candidatesToMove: PageCandidateDto[] = [];

  /**
   * Basic filter.
   */
  candidateFilter: AdministrationCandidateFilterDto = this.filterService.getManageCandidateFilterDto();

  subscribtion: Subscription;

  candidateFilterWorkPermitNecessary: any = 'all';
  readonly EMPL_OVERH = ['empl', 'overh'];

  constructor(private route: ActivatedRoute,
              public candidateService: CandidateService,
              private router: Router,
              private notificationService: NotificationService,
              private loadingService: LoadingService,
              private userService: UserService,
              private modalService: NgbModal,
              private filterService: FilterService,
              public companyService: CompanyService) {
  }

  ngOnInit() {
    this.candidates = this.route.snapshot.data['candidatesData'][0];
    this.candidateFilter = this.route.snapshot.data['candidatesData'][1];
    this.formData = this.route.snapshot.data['formData'];
    this.laptopModelsList = this.formData.laptopModels;
    this.companyList = this.formData.companies;
    this.typeList = this.formData.jobtypes;
    this.keyboardList = this.formData.keyboardModels;
    this.statusList = this.formData.candidateStates;

    this.userService.hasAdminRole().then((isAdmin: boolean) => {
      this.isUserAdministrator = isAdmin;
    });

    this.candidateFilterNewGraduate = isNullOrUndefined(this.candidateFilter.newgraduate) ? 'all'
      : (this.candidateFilter.newgraduate ? 'yes' : 'no');
    this.candidateFilterStartDate = this.candidateFilter.startDate;

    this.candidateFilterWorkPermitNecessary = isNullOrUndefined(this.candidateFilter.workPermitNecessary) ? 'all'
      : (this.candidateFilter.workPermitNecessary ? 'yes' : 'no');

    this.subscribtion = this.candidateService.deleteCandidateSubject.subscribe(() => this.fetchAllCandidates());
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  /**
   * Changes the laptop model.
   */
  changeLaptopModel(filter) {
    this.candidateFilter.laptops = filter;
  }

  /**
   * Changes the status.
   */
  changeStatus(filter) {
    this.candidateFilter.status = filter;
  }

  /**
   * Changes the company.
   */
  changeCompany(filter) {
    this.candidateFilter.companies = filter;
  }

  /**
   * Change the type.
   */
  changeType(filter) {
    this.candidateFilter.types = filter;
  }

  /**
   * Change the keyboard.
   */
  changeKeyboard(filter) {
    this.candidateFilter.keyboards = filter;
  }

  /**
   * Change the new graduate option
   */
  changeNewGraduate() {
    this.searchWithFilter();
  }


  /**
   * Change the work permit option
   */
  changeWorkPermitNecessary() {
    this.searchWithFilter();
  }

  /**
   * Change the column to sort.
   * @param event column.
   */
  changeSort(event) {
    if (this.candidateFilter.sortingRow === event) {
      this.candidateFilter.ascending = !this.candidateFilter.ascending;
    } else {
      this.candidateFilter.sortingRow = event;
      this.candidateFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllCandidates();
  }

  /**
   * Fetch the candidates (filtered).
   */
  fetchAllCandidates() {
    if (this.candidateFilterStartDate != null && typeof this.candidateFilterStartDate !== 'string') {
      this.candidateFilter.startDate = DateConvertorService.convertDateToString(this.candidateFilterStartDate);
    } else {
      this.candidateFilter.startDate = this.candidateFilterStartDate;
    }
    if (this.candidateFilterNewGraduate && this.candidateFilterNewGraduate !== 'all') {
      this.candidateFilter.newgraduate = this.candidateFilterNewGraduate === 'yes';
    } else {
      this.candidateFilter.newgraduate = null;
    }

    if (this.candidateFilterWorkPermitNecessary && this.candidateFilterWorkPermitNecessary !== 'all') {
      this.candidateFilter.workPermitNecessary = this.candidateFilterWorkPermitNecessary === 'yes';
    } else {
      this.candidateFilter.workPermitNecessary = null;
    }

    const filter: AdministrationCandidateFilterDto = {
      fullname: this.candidateFilter.fullname,
      status: this.candidateFilter.status,
      companies: this.candidateFilter.companies,
      account: this.candidateFilter.account,
      startDate: this.candidateFilter.startDate,
      types: this.candidateFilter.types,
      laptops: this.candidateFilter.laptops,
      keyboards: this.candidateFilter.keyboards,
      newgraduate: this.candidateFilter.newgraduate,
      sortingRow: this.candidateFilter.sortingRow,
      ascending: this.candidateFilter.ascending,
      workPermitNecessary: this.candidateFilter.workPermitNecessary
    };
    this.candidateService.getFilteredCandidates(filter, this.pageSize, this.pageIndex)
      .then(
        (data: PageDto<PageCandidateDto>) => {
          this.candidates = data;
          this.selectAll = false;
        });
  }

  /**
   * Change the page size.
   */
  changePageSize() {
    this.changePage(0);
  }

  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllCandidates();
  }

  /**
   * Translate the long laptop name into a shorter one.
   * @param laptop The laptop type.
   */
  translateLaptopType(laptop: string): string {
    if (laptop != null && laptop.indexOf(':') !== -1) {
      return laptop.substring(0, laptop.indexOf(':'));
    }
    return laptop;
  }

  /**
   * Translates the short job type (e.g. 'free') to the complete job type (here Freelance).
   * @param jobTypeShort The short job type.
   */
  translateJobType(jobTypeShort): string {
    const findResource = this.typeList.filter(elt => {
      return elt.description === jobTypeShort;
    });

    return findResource.length === 0 ? '' : findResource[0].jobType;

  }

  /**
   * Translates the short status (e.g. 'PROPAL_SENT') to the complete status (here Sent).
   * @param statusTypeShort The short job type.
   */
  translateStatusType(statusTypeShort): string {
    const findResource = this.statusList.filter(elt => {
      return elt.status === statusTypeShort;
    });

    return findResource.length === 0 ? '' : findResource[0].description;
  }

  /**
   * Move the person corresponding to the account in the resources.
   * @param account The account.
   */
  move(account: string) {
    const confirmationModal = this.modalService.open(ConfirmationModalComponent, {centered: true});

    confirmationModal.componentInstance.account = account;
    confirmationModal.componentInstance.action = 'move';
  }

  /**
   * Move the list of selected resources.
   */
  moveSelected() {
    const confirmationModal = this.modalService.open(ConfirmationModalComponent, {centered: true});

    confirmationModal.componentInstance.action = 'move';
    confirmationModal.componentInstance.multiple = true;
    confirmationModal.componentInstance.list = this.candidatesToMove;
  }

  /**
   * Delete from the set of candidates the account.
   * @param account - Account to delete.
   */
  delete(account: string) {
    const confirmationModal = this.modalService.open(ConfirmationModalComponent, {centered: true});

    confirmationModal.componentInstance.account = account;
    confirmationModal.componentInstance.action = 'delete';
  }

  /**
   * Select or unselect all the request.
   */
  selectAllCandidates(): void {
    this.candidatesToMove.length = 0;
    for (const candidate of this.candidates.content) {
      if (candidate.status === 'CONTRACT_SIGNED' && (
          !this.companyService.luxCompanies.includes(candidate.company) ||
          !this.EMPL_OVERH.includes(candidate.resourceType) ||
          (candidate.residentialCountry && this.EMPL_OVERH.includes(candidate.resourceType))
        )
      ) {
        candidate.checked = this.selectAll;
        if (this.selectAll) {
          this.candidatesToMove.push(candidate);
        }
      }
    }
  }

  /**
   * Add or remove candidate to the list of selected candidates.
   * @param event - click event on the checkbox.
   * @param candidate - The candidate to add or remove.
   */
  addCandidatesToList(event, candidate: PageCandidateDto) {
    if (candidate.status === 'CONTRACT_SIGNED') {
      if (event.target.checked) {
        candidate.checked = true;
        this.candidatesToMove.push(candidate);
      } else {
        candidate.checked = false;
        const requestToDelete: number = this.candidatesToMove.indexOf(candidate);
        this.candidatesToMove.splice(requestToDelete, 1);
      }
      this.checkSelectAllInput();
    }
  }

  /**
   * Check if the select all checkbox must be checked or not.
   */
  checkSelectAllInput() {
    if (this.selectAll) {
      for (const candidate of this.candidates.content) {
        if (candidate.status === 'CONTRACT_SIGNED') {
          if (!candidate.checked) {
            this.selectAll = false;
          }
        }
      }
    } else {
      let isAllSelected = true;
      for (const candidate of this.candidates.content) {
        if (candidate.status === 'CONTRACT_SIGNED') {
          if (!candidate.checked) {
            isAllSelected = false;
          }
        }
      }
      this.selectAll = isAllSelected;
    }
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }

}
