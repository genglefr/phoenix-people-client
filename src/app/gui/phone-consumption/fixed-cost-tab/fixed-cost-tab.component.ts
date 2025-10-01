import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CompanyDto,
  PageDto,
  PhoneFixedCostDto,
  PhoneFixedCostFilterDto
} from '../../../model';
import {PhoneConsumptionService} from '../../../services/PhoneConsumption/phone-consumption.service';
import {NotificationService} from '../../../services/notification.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditFixedCostComponent} from '../../modal/edit-fixed-cost/edit-fixed-cost.component';
import {ConfirmModalComponent} from '../../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-fixed-cost-tab',
  templateUrl: './fixed-cost-tab.component.html',
  styleUrls: ['./fixed-cost-tab.component.sass']
})
export class FixedCostTabComponent implements OnInit {
  @Input()
  phoneFixedCostPage: PageDto<PhoneFixedCostDto>;
  @Input()
  pageIndex = 0;
  @Output()
  pageIndexChange = new EventEmitter<number>();
  @Input()
  pageSize = 25;
  @Output()
  pageSizeChange = new EventEmitter<number>();
  @Input()
  phoneFixedCostPeriodList: string[] = [];
  @Output()
  phoneFixedCostPeriodListChange = new EventEmitter<string[]>();
  @Input()
  resourceCompanyList: CompanyDto[] = [];

  @Input()
  phoneFixedCostFilter: PhoneFixedCostFilterDto;
  constructor(private phoneConsumptionService: PhoneConsumptionService, private modalService: NgbModal,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }

  /**
   * Get all the fixed cost (filtered).
   */
  fetchAllFixedCosts() {
    this.phoneConsumptionService.getPhoneFixedCosts(this.phoneFixedCostFilter, this.pageSize, this.pageIndex)
      .then(
        (data: PageDto<PhoneFixedCostDto>) => {
          this.phoneFixedCostPage = data;
        }
      );
  }

  /**
   * Change the entity.
   */
  changeEntity(event) {
    this.phoneFixedCostFilter.companies = event;
  }

  /**
   * Change the type.
   */
  changePeriod(event) {
    this.phoneFixedCostFilter.periods = event;
  }


  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllFixedCosts();
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.phoneFixedCostFilter.sortingRow === event) {
      this.phoneFixedCostFilter.ascending = !this.phoneFixedCostFilter.ascending;
    } else {
      this.phoneFixedCostFilter.sortingRow = event;
      this.phoneFixedCostFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllFixedCosts();
  }

  /**
   * Change page size and fetch all jira projects
   */
  changePageSize() {
    this.pageIndex = 0;
    this.fetchAllFixedCosts();
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }

  /**
   * Open import modal
   */
  openAddCostModal(phoneFixedCost: PhoneFixedCostDto = null) {
    const modalRef = this.modalService.open(
      EditFixedCostComponent, {backdrop: 'static', centered: true}
    );
    modalRef.componentInstance.companyList = this.resourceCompanyList;
    modalRef.componentInstance.phoneFixedCostDto = phoneFixedCost;
    modalRef.result.then(
      (phoneFixedCostDto) => {
        if(phoneFixedCostDto) {
            this.refreshData();
            this.notificationService.addSuccessToast(`The fixed cost has been ${phoneFixedCost ? 'updated' : 'created'} successfully`);
          }
        }
    );
  }

  /**
   * Delete phone fixed cost
   * @param phoneFixedCost to delete
   */
  deletePhoneFixedCost(phoneFixedCost: PhoneFixedCostDto = null) {
    this.phoneConsumptionService.deleteFixedCost(phoneFixedCost.id).then(() => {
      this.refreshData();
      this.notificationService.addSuccessToast('The fixed cost has been deleted successfully');
    });
  }

  /**
   * Refresh data displayed
   */
  refreshData() {
    this.fetchAllFixedCosts();
    this.phoneConsumptionService.getFixedCostsPeriods().then(
      periodList => this.phoneFixedCostPeriodList = periodList
    );
  }

  /**
   * Open delete modal
   * @param phoneFixedCost fixed cost
   */
  openDeleteModal(phoneFixedCost: PhoneFixedCostDto) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = 'Are you sure that you want to delete this fixed cost ?';
      modal.componentInstance.confirmationTitle = 'Delete fixed cost';
      modal.result.then(result => {
        if (result) {
          this.deletePhoneFixedCost(phoneFixedCost);
        }
      });
  }
}
