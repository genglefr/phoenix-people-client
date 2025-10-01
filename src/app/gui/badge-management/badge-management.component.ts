import {Component, OnInit, ViewChild} from '@angular/core';
import {
  BadgeDto,
  BadgeFilterDto,
  BadgeHistoryDto,
  BadgeHistoryFilterDto, CompanyDto,
  PageDto,
  ResourceFullNameAndAccountDto
} from '../../model';
import {FilterService} from '../../services/Filter/filter.service';
import {merge, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {BadgeService} from '../../services/Badge/badge.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbCalendar, NgbDate, NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import {DateConvertorService} from '../../services/date-convertor.service';
import {NotificationService} from '../../services/notification.service';
import {ConfirmModalComponent} from '../modal/confirm-modal/confirm-modal.component';
import {ExportResourcesService} from '../../services/ExportResources/export-resources.service';
import {UserService} from '../../services/User/user.service';

declare const accentFold: any;

@Component({
  selector: 'app-badge-management',
  templateUrl: './badge-management.component.html',
  styleUrls: ['./badge-management.component.sass']
})
export class BadgeManagementComponent implements OnInit {

  badges: PageDto<BadgeDto>;
  accessTypes: any[] = [];
  readonly BELVAL_PLAZA = 'PARKING BELVAL PLAZA';
  resources: ResourceFullNameAndAccountDto[] = [];

  historyBadges: BadgeHistoryDto[];
  badgeHistory: PageDto<BadgeHistoryDto>;

  pageIndex = 0;
  pageSize = 25;

  isAdmin = false;
  isAdminOrRead = false;
  isAdminOrBadgeRead = false;
  isAdminStrict = false;

  isCreation = true;

  @ViewChild('instanceOwner') instanceOwner: NgbTypeahead;
  clickOwner = new Subject<string>();

  @ViewChild('exitButton') exitButton;

  @ViewChild('exitHistoryButton') exitHistoryButton;
  @ViewChild('showModalHistory') showModalHistoryButton;


  badgeEdit: BadgeDto = {} as BadgeDto;

  /** FORMS **/
  badgeForm = new FormGroup({
    'badgeNumber': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    'owner': new FormControl(null),
    'accessTypes': new FormControl(null),
    'returnDate': new FormControl(null),
    'attributionDate': new FormControl(null),
    'comment': new FormControl(null, [Validators.maxLength(4000)])
  });

  badgeFilter: BadgeFilterDto = this.filterService.getBadgeFilterDto();
  badgeHistoryFilter: BadgeHistoryFilterDto = {
    'sortingRow': 'revisionDate',
    'ascending': true
  } as BadgeHistoryFilterDto;

  managedCompanies: CompanyDto[] = [];
  selectedCompanies: CompanyDto[] = [];

  constructor(private filterService: FilterService, private badgeService: BadgeService,
              private route: ActivatedRoute, private calendar: NgbCalendar,
              private notificationService: NotificationService,
              private modalService: NgbModal, private exportService: ExportResourcesService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data.data;
    this.accessTypes = data[0].map(elt => {
      return {'value': elt};
    });
    this.badges = data[1];
    this.resources = data[2];

    this.userService.hasAdminRole().then(isAdmin => this.isAdmin = isAdmin);
    this.userService.isAdministrator().then(isAdmin => this.isAdminStrict = isAdmin);
    this.userService.isAdminOrRead().then(isAdminorRead => this.isAdminOrRead = isAdminorRead);
    this.userService.isReadBadge().then(isBadgeRead => this.isAdminOrBadgeRead = isBadgeRead || this.isAdmin);

    this.managedCompanies = data[3];
  }

  /**
   * Formats the owner display.
   * @param x the value.
   */
  formatterOwner = (x: ResourceFullNameAndAccountDto) => {
    return x && x.firstName && x.lastName ?
      `${x.firstName} ${x.lastName}` : x;
  }

  /**
   * Retrieve the badge number control.
   */
  get badgeNumber(): AbstractControl {
    return this.badgeForm.get('badgeNumber');
  }

  /**
   * Retrieve the owner control.
   */
  get owner(): AbstractControl {
    return this.badgeForm.get('owner');
  }

  /**
   * Retrieve the accessTypesControl
   */
  get accessTypesControl(): AbstractControl {
    return this.badgeForm.get('accessTypes');
  }

  /**
   * Retrieve the return date.
   */
  get returnDate(): AbstractControl {
    return this.badgeForm.get('returnDate');
  }

  /**
   * Retrieve the return date.
   */
  get attributionDate(): AbstractControl {
    return this.badgeForm.get('attributionDate');
  }

  /**
   * Retrieve today's date.
   */
  get todayDate(): NgbDate {
    return this.calendar.getToday();
  }

  /**
   * Retrieve comment.
   */
  get comment(): AbstractControl {
    return this.badgeForm.get('comment');
  }

  /**
   * Changes the access types.
   * @param input the input to set.
   */
  changeAccessType(input: any[]) {
    this.badgeFilter.accessTypes = input;
  }

  /**
   * Fetch the page of badges.
   */
  fetchPageBadge() {
    this.badgeService.getBadgePage(this.badgeFilter, this.pageSize, this.pageIndex)
      .then(data => this.badges = data);
  }

  /**
   * Resets the page index and refilter the page of badges.
   */
  resetAndFetchPageBadge() {
    this.pageIndex = 0;
    this.fetchPageBadge();
  }

  /**
   * Changes the sort of column.
   * @param event the name of the column to sort on.
   */
  changeSort(event) {
    if (this.badgeFilter.sortingRow === event) {
      this.badgeFilter.ascending = !this.badgeFilter.ascending;
    } else {
      this.badgeFilter.sortingRow = event;
      this.badgeFilter.ascending = true;
    }
    this.resetAndFetchPageBadge();
  }

  /**
   * Change the history sort.
   * @param event the event to process.
   */
  changeHistorySort(event) {
    if (this.badgeHistoryFilter.sortingRow === event) {
      this.badgeHistoryFilter.ascending = !this.badgeHistoryFilter.ascending;
    } else {
      this.badgeHistoryFilter.sortingRow = event;
      this.badgeHistoryFilter.ascending = true;
    }
    this.fetchBadgeHistory();
  }

  /**
   * Changes the page size.
   * @param size the size to set.
   */
  changePageSize(size: number) {
    this.pageSize = size;
    this.fetchPageBadge();
  }

  /**
   * Changes the page index.
   * @param index the index to set.
   */
  changePage(index: number) {
    this.pageIndex = index;
    this.fetchPageBadge();
  }

  /**
   * Search the owner.
   * @param text$ the text to search on.
   */
  searchOwner = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickOwner.pipe(filter(() => !this.instanceOwner.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ?
          this.resources :
          this.resources.filter(v => this.checkResourceIncludesOwnerName(term, v))
        ).slice(0, 10)
      )
    );
  }

  /**
   * Checks if the resource included the text value.
   * @param text the text to check.
   * @param resource the resource to compare the first and last name to.
   */
  checkResourceIncludesOwnerName(text: any, resource: ResourceFullNameAndAccountDto): boolean {
    const firstName = accentFold(resource.firstName);
    const lastName = accentFold(resource.lastName);
    const foldedText = accentFold(String(text).toLowerCase());

    return `${firstName} ${lastName}`.includes(foldedText) ||
      `${lastName} ${firstName}`.includes(foldedText);
  }

  /**
   * Checks the owner value.
   */
  checkOwnerValue() {
    if (this.owner.value && !this.resources.some(elt => elt.firstName === this.owner.value.firstName &&
      elt.lastName === this.owner.value.lastName)) {
      this.owner.setValue(null);
      this.returnDate.setValue(null);
      this.attributionDate.setValue(null);
      this.returnDate.disable();
      this.attributionDate.disable();
    } else if (!this.owner.value) {
      this.returnDate.setValue(null);
      this.attributionDate.setValue(null);
      this.returnDate.disable();
      this.attributionDate.disable();
    } else {
      this.returnDate.enable();
      this.attributionDate.enable();
    }
  }

  /**
   * Sets the values for the access types.
   * @param values the values to set.
   */
  changeValueAccessTypes = (values) => {
    this.accessTypesControl.setValue(values);
    this.accessTypesControl.markAsDirty();
  }

  /**
   * Sets the values for the selected companies.
   * @param values the values to set.
   */
  changeSelectedCompanies = (values) => {
    this.selectedCompanies = values;
  }

  /**
   * Closes the modal.
   */
  closeModal() {
    if (this.badgeForm.pristine || window.confirm('Are you sure you want to discard your changes?')) {
      this.exitButton.nativeElement.click();
    }
  }

  /**
   * Closes the history modal.
   */
  closeHistoryModal() {
    this.clearHistoryFilter();
    this.exitHistoryButton.nativeElement.click();
  }

  /**
   * Clear the form.
   */
  clearForm() {
    this.badgeForm.reset();
    this.returnDate.disable();
    this.attributionDate.disable();
  }

  /**
   * Sets the values of the badge to the form.
   * @param badge the badge to patch.
   */
  setForm(badge: BadgeDto) {
    this.badgeNumber.patchValue(badge.badgeNumber);
    this.owner.patchValue(badge.resource);
    this.returnDate.patchValue(badge.returnDate ?
      DateConvertorService.getNgbDateStructFromString(badge.returnDate) :
      null);
    this.attributionDate.patchValue(badge.attributionDate ?
      DateConvertorService.getNgbDateStructFromString(badge.attributionDate) :
      null);
    this.comment.patchValue(badge.comment);
    this.accessTypesControl.patchValue(badge.accessTypes);

    if (badge.resource == null) {
      this.returnDate.setValue(null);
      this.attributionDate.setValue(null);
      this.returnDate.disable();
      this.attributionDate.disable();
    } else {
      this.returnDate.enable();
      this.attributionDate.enable();
    }
  }

  /**
   * Set the badge to edit.
   * Emtpty object if creation.
   * @param badge to edit.
   */
  setBadgeEdit(badge: any) {
    this.badgeEdit = badge;
    if (this.badgeEdit.id) {
      this.badgeNumber.disable();
      this.setForm(badge);
      this.isCreation = false;
    } else {
      this.badgeNumber.enable();
      this.clearForm();
      this.isCreation = true;
    }
  }

  /**
   * Saves the badge.
   */
  saveBadge() {
    const badge = {
      id: this.badgeEdit.id,
      badgeNumber: this.badgeEdit.id ? this.badgeEdit.badgeNumber : this.badgeNumber.value,
      accessTypes: this.accessTypesControl.value,
      resource: this.owner.value ? this.owner.value : null,
      comment: this.comment.value,
      returnDate: this.returnDate.value && this.accessTypesControl.value && this.accessTypesControl.value.includes(this.BELVAL_PLAZA)
        ? DateConvertorService.convertDateToString(this.returnDate.value)
        : null,
      attributionDate: this.attributionDate.value
      && this.accessTypesControl.value
      && this.accessTypesControl.value.includes(this.BELVAL_PLAZA)
        ? DateConvertorService.convertDateToString(this.attributionDate.value)
        : null
    } as BadgeDto;
    this.badgeService.createOrUpdateBadge(badge)
      .then(() => {
        this.badgeForm.reset();
        // @ts-ignore
        this.notificationService.addSuccessToast(`The badge has been ${this.badgeEdit.id ? 'updated' :
          'created'} successfully`);
        this.resetAndFetchPageBadge();
        this.closeModal();
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Delete the selected badge.
   * @param badge the badge to delete.
   */
  deleteBadge(badge: BadgeDto) {
    if (badge.id) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = `Are you sure that you want to delete this badge (Badge number: ${badge.badgeNumber})?`;
      modal.componentInstance.confirmationTitle = 'Delete badge';
      modal.result.then(result => {
        if (result) {
          this.badgeService.deleteBadge(badge).then((response) => {
            if (response) {
              this.notificationService.addSuccessToast('The badge has been deleted successfuly');
              this.resetAndFetchPageBadge();
            } else {
              this.notificationService.addWarningToast('The badge has already been deleted');
            }
          });
        }
      });
    }
  }

  /**
   * Fetches the badge history and display the history modal.
   * @param badge the badge to fetch the history for.
   */
  fetchBadgeHistoryAndDisplayModal(badge: BadgeDto) {
    if (badge.id) {
      this.clearHistoryFilter();
      this.badgeHistoryFilter.badgeId = badge.id;
      this.badgeService.getBadgeHistoryPage(this.badgeHistoryFilter)
        .then(data => {
          this.badgeHistory = data;
          this.showModalHistoryButton.nativeElement.click();
        });
    }
  }

  /**
   * Fetches the badge history.
   */
  fetchBadgeHistory() {
    this.badgeService.getBadgeHistoryPage(this.badgeHistoryFilter)
      .then(data => this.badgeHistory = data);
  }

  /**
   * Clear the history filter.
   */
  clearHistoryFilter() {
    this.badgeHistoryFilter = {
      sortingRow: 'revisionDate',
      ascending: true
    } as BadgeHistoryFilterDto;
  }

  /**
   * Export resource table as an excel
   */
  exportBelvalPlaza() {
    this.exportService.exportBelvalPlazaBadges().then(() => {
      this.notificationService.addSuccessToast('Export file successfully created');
    });
  }

  /**
   * Export badges by companies.
   */
  exportBadgesByCompany() {
    this.exportService.exportBadgesByCompanies(this.selectedCompanies)
      .then(() => {
        this.notificationService.addSuccessToast('Export file successfully created');
      });
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.resetAndFetchPageBadge();
  }
}
