import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyDto, PageDto, ResourceFilterDto, WhoIsWhoResourceDto} from '../../../model';
import {ResourceService} from '../../../services/Resource/resource.service';
import {NotificationService} from '../../../services/notification.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-usource-desktopview',
  templateUrl: './usource-desktopview.component.html',
  styleUrls: ['./usource-desktopview.component.sass']
})
export class UsourceDesktopviewComponent implements OnInit, OnDestroy {

  resources: PageDto<WhoIsWhoResourceDto>;
  resourceCompanyList: CompanyDto[] = [];
  pageIndex = 0;
  pageSize = 25;
  resourceFilter: ResourceFilterDto;
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router,
              private notificationService: NotificationService,
              private resourceService: ResourceService) {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.resources = this.route.snapshot.data.data[0];
    this.resourceCompanyList = this.route.snapshot.data.data[1];
    this.resourceFilter = this.route.snapshot.data.data[2];

    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.pageIndex = 0;
        window.scroll(0, 0);
      }
    });
  }

  /**
   * Change resources table page
   * @param pageIndex page index
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllResources();
  }

  /**
   * Returns all the resources filtered (excludes Consortium, Profile and PTM)
   */
  fetchAllResources() {
    const filter: ResourceFilterDto = {
      fullSearch: this.resourceFilter.fullSearch,
      companies: this.resourceFilter.companies,
      sortingRow: this.resourceFilter.sortingRow,
      ascending: this.resourceFilter.ascending,
    };
    this.resourceService.getResources(filter, this.pageSize, this.pageIndex)
      .then(
        (data: PageDto<WhoIsWhoResourceDto>) => {
          this.resources = data;
        }
      );
  }

  /**
   * Change entity value in filter
   * @param filter new value
   */
  changeEntity(filter) {
    this.resourceFilter.companies = filter;
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
   * Search with filter applied
   */
  searchWithFilter() {
    this.pageIndex = 0;
    this.fetchAllResources();
  }
}
