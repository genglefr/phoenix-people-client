import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {ResourceService} from '../../services/Resource/resource.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {DOCUMENT} from '@angular/common';
import {
  AdministrationResourceFilterDto,
  CompanyDto,
  FullResourceDto,
  PageDto,
  PageResourceDto,
  UserAppDto,
  WrapperEJobTypeDto
} from '../../model';
import {ConnectedUserNotifierService} from '../../services/connected-user-notifier.service';
import {UserService} from '../../services/User/user.service';
import {DateConvertorService} from '../../services/date-convertor.service';
import {FilterService} from '../../services/Filter/filter.service';
import {ExportResourcesService} from '../../services/ExportResources/export-resources.service';
import * as moment from 'moment';


declare const accentFold: any;

@Component({
    selector: 'app-resources-list',
    templateUrl: './resources-list.component.html',
    styleUrls: ['./resources-list.component.sass']
})
export class ResourcesListComponent implements OnInit {

    resources: PageDto<PageResourceDto>;
    pageIndex = 0;
    pageSize = 25;
    resourceTypeList: WrapperEJobTypeDto[] = [];
    resourceCompanyList: CompanyDto[] = [];
    isUserAdministrator: boolean;
    hasAdminRole: boolean;
    readonly currentPeriod: string = moment().format('YYYYMM');

    resourceFilter: AdministrationResourceFilterDto;

    user: FullResourceDto;
    userPrivileges: UserAppDto;

    resourceFilterStartDate: any;
    resourceFilterEndDate: any;
    comparisLink: string = environment.comparisLink;
    plarisLink: string = environment.plarisLink;
    holarisLink: string = environment.holarisLink;
    evaLink: string = environment.evaLink;
    timesheetLink: string = environment.timesheetLink;

    constructor(private route: ActivatedRoute, private router: Router, private notificationService: NotificationService,
                private resourceService: ResourceService, @Inject(DOCUMENT) private document: Document,
                private notifier: ConnectedUserNotifierService, private userService: UserService,
                private filterService: FilterService, private exportService: ExportResourcesService) {
        this.user = this.notifier.getUser();
        this.userService.getAuthenticatedUser().then((data) => {
                this.userPrivileges = data;
            }
        );
    }

    ngOnInit() {
        const data = this.route.snapshot.data.data;
        this.resources = data[0];
        this.resourceCompanyList = data[1];
        this.resourceTypeList = data[2];
        this.resourceFilter = data[3];
        this.resourceFilterEndDate = this.resourceFilter.endDate;
        this.resourceFilterStartDate = this.resourceFilter.startDate;

        this.userService.isAdministrator().then((isAdmin: boolean) => {
            this.isUserAdministrator = isAdmin;
        });
        this.userService.hasAdminRole().then((isAdmin: boolean) => {
            this.hasAdminRole = isAdmin;
        });
    }

    /**
     * Get all the resources (filtered).
     */
    fetchAllResources() {
        if (this.resourceFilterStartDate != null && typeof this.resourceFilterStartDate !== 'string') {
            this.resourceFilter.startDate = DateConvertorService.convertDateToString(this.resourceFilterStartDate);
        } else {
            this.resourceFilter.startDate = this.resourceFilterStartDate;
        }

        if (this.resourceFilterEndDate != null && typeof this.resourceFilterEndDate !== 'string') {
            this.resourceFilter.endDate = DateConvertorService.convertDateToString(this.resourceFilterEndDate);
        } else {
            this.resourceFilter.endDate = this.resourceFilterEndDate;
        }

        const filter: AdministrationResourceFilterDto = {
            fullname: this.resourceFilter.fullname,
            account: this.resourceFilter.account,
            companies: this.resourceFilter.companies,
            types: this.resourceFilter.types,
            sortingRow: this.resourceFilter.sortingRow,
            ascending: this.resourceFilter.ascending,
            activity: this.resourceFilter.activity,
            startDate: this.resourceFilter.startDate,
            endDate: this.resourceFilter.endDate
        };
        this.resourceService.getFullResources(filter, this.pageSize, this.pageIndex)
            .then(
                (data: PageDto<PageResourceDto>) => {
                    this.resources = data;
                }
            );
    }

    /**
     * Translates the short job type (e.g. 'free') to the complete job type (here Freelance).
     * @param jobTypeShort The short job type.
     */
    translateJobType(jobTypeShort): string {
        const findResource = this.resourceTypeList.filter(elt => {
            return elt.description === jobTypeShort;
        });

        return findResource.length === 0 ? '' : findResource[0].jobType;

    }

    /**
     * Return timestamp for no cache image in seconds
     */
    getTimestamp(): number {
      return Math.floor(new Date().getTime() / 1000);
    }

    /**
     * Change the entity.
     */
    changeEntity(filter) {
      this.resourceFilter.companies = filter;
    }

    /**
     * Change the type.
     */
    changeType(filter) {
      this.resourceFilter.types = filter;
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
     * Change page size and fetch all jira projects
     */
    changePageSize() {
        this.pageIndex = 0;
        this.fetchAllResources();
    }

    /**
     * Checks if the admin has access to Evaris for that company
     * @param company - company associated to the administrator (connected user)
     * @param resourceType - type of resource
     */
    hasAccessToEva(company: string, resourceType: string) {
        if (!this.userPrivileges) {
            return false;
        }
        return this.userPrivileges.entitiesAccessibleThroughEva.find(
            item => company && item && company.toLowerCase() === item.toLowerCase()
            )
            && (resourceType && (resourceType.toLowerCase() === 'empl' || resourceType.toLowerCase() === 'overh'));
    }

    /**
     * Checks if the admin has access to Evaris
     */
    hasFullAccessToEva() {
      return this.userPrivileges.authorities.some(elt => elt.authority === 'USOURCE_EVA_OPERATION_MANAGER');
    }

    /**
     * Export resource table as an excel
     */
    export() {
        this.exportService.exportResources(this.resourceFilter).then(() => {
            this.notificationService.addSuccessToast('Export file successfully created');
        });
    }

    /**
     * Search with filter applied
     */
    searchWithFilter() {
      this.changePage(0);
    }
}
