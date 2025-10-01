import { Component, OnInit } from '@angular/core';
import {
  AdministrationResourceFilterDto,
  ManagerBoardFilterDto,
  ManagerBoardResourceDto,
  PageDto,
  WrapperEJobTypeDto
} from '../../model';
import {FilterService} from '../../services/Filter/filter.service';
import {ActivatedRoute} from '@angular/router';
import {OnBoardingService} from '../../services/OnBoarding/on-boarding.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/User/user.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.sass']
})
export class ManagerDashboardComponent implements OnInit {

  started = 'Active';
  onboarding = 'Not Started';

  usourceURL: string;
  smartRecruiterURL: string;

  isUserAdministrator: boolean;
  hasReadRole: boolean;

  resourceFilter: ManagerBoardFilterDto = this.filterService.getManagerBoardFilterDto();
  resourceTypeList: WrapperEJobTypeDto[] = [];

  pageIndex = 0;
  pageSize = 25;

  resources: PageDto<ManagerBoardResourceDto>;

  constructor(private route: ActivatedRoute,
              private onboardingService: OnBoardingService,
              private userService: UserService,
              private notificationService: NotificationService,
              private filterService: FilterService) {
  }

  ngOnInit() {
    this.usourceURL = environment.usourceLink;
    this.smartRecruiterURL = environment.smartRecruiterLink;
    const data = this.route.snapshot.data;
    this.resources = data['data'][0];
    this.resourceTypeList = data['data'][1];

    this.userService.isAdministrator().then((value: boolean) => {
      this.isUserAdministrator = value;
    });
    this.userService.hasReadRole().then((value: boolean) => {
      this.hasReadRole = value;
    });
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.resourceFilter.sortingRow === event) {
      this.resourceFilter.ascending = !this.resourceFilter.ascending;
    } else {
      this.resourceFilter.sortingRow = event;
      this.resourceFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllResources();
  }

  /**
   * Change the type.
   */
  changeType(filter) {
    this.resourceFilter.resourceTypes = filter;
  }

  /**
   * Change page size and fetch all onboarding resources.
   */
  changePageSize() {
    this.pageIndex = 0;
    this.fetchAllResources();
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
   * Change the status.
   */
  changeStatus() {
    this.searchWithFilter();
  }

  /**
   * Fetch all the onboarding resources.
   */
  fetchAllResources() {
    this.onboardingService.getResourceForManagerBoard(this.resourceFilter, this.pageSize, this.pageIndex).then(data => {
      this.filterService.setManagerBoardFilterDto(this.resourceFilter);
      this.resources = data;
    });
  }

  /**
   * Redirect to SmartRecruiter.
   * @param srId of the candidate.
   */
  redirectToSR(srId: string) {
    if (srId) {
      window.open(`${this.smartRecruiterURL}${srId}`, '_blank');
    } else {
      this.notificationService.addErrorToast('No link exists for this candidate between Smartrecruiters and U-Source');
    }
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }
}
