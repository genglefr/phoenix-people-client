import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CompanyDto,
  EPhoneConsumptionStatus,
  PageDto,
  PhoneConsumptionDto,
  PhoneConsumptionFilterDto
} from '../../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {PhoneConsumptionService} from '../../../services/PhoneConsumption/phone-consumption.service';

@Component({
  selector: 'app-consumption-tab',
  templateUrl: './consumption-tab.component.html',
  styleUrls: ['./consumption-tab.component.sass']
})
export class ConsumptionTabComponent implements OnInit {
  @Input()
  phoneConsumptionPage: PageDto<PhoneConsumptionDto>;
  @Input()
  pageIndex = 0;
  @Output()
  pageIndexChange = new EventEmitter<number>();
  @Input()
  pageSize = 25;
  @Output()
  pageSizeChange = new EventEmitter<number>();
  @Input()
  phoneConsumptionStatusList: EPhoneConsumptionStatus[] = [];
  @Input()
  phoneConsumptionPeriodList: string[] = [];
  @Input()
  resourceCompanyList: CompanyDto[] = [];

  @Input()
  phoneConsumptionFilter: PhoneConsumptionFilterDto;
  constructor(private route: ActivatedRoute, private router: Router, private notificationService: NotificationService,
              private phoneConsumptionService: PhoneConsumptionService) { }

  ngOnInit() {
  }

  /**
   * Get all the resources (filtered).
   */
  fetchAllResources() {
    this.phoneConsumptionService.getPhoneConsumptions(this.phoneConsumptionFilter, this.pageSize, this.pageIndex)
      .then(
        (data: PageDto<PhoneConsumptionDto>) => {
          this.phoneConsumptionPage = data;
        }
      );
  }

  /**
   * Change the entity.
   */
  changeEntity(event) {
    this.phoneConsumptionFilter.companies = event;
  }

  /**
   * Change the type.
   */
  changePeriod(event) {
    this.phoneConsumptionFilter.periods = event;
  }

  /**
   * Change the activity.
   * @param activity The activity.
   */
  changeActivity(activity) {
    this.searchWithFilter();
  }


  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllResources();
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.phoneConsumptionFilter.sortingRow === event) {
      this.phoneConsumptionFilter.ascending = !this.phoneConsumptionFilter.ascending;
    } else {
      this.phoneConsumptionFilter.sortingRow = event;
      this.phoneConsumptionFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllResources();
  }

  /**
   * Change page size and fetch all jira projects
   */
  changePageSize() {
    this.pageIndex = 0;
    this.fetchAllResources();
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }

  /**
   * Refresh costs
   */
  refreshCosts() {
    this.phoneConsumptionService.refreshCosts(this.phoneConsumptionFilter).then(
      () => {
        const successMessage =
          `Costs of ${this.phoneConsumptionFilter.companies
            ? this.phoneConsumptionFilter.companies.map(company => company).join(', ')
            : 'all costs'
          } successfully refreshed`;
        this.notificationService.addSuccessToast(successMessage);
        this.searchWithFilter();
      }
    );
  }

}
