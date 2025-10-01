import {Component, OnInit} from '@angular/core';
import {CompanyDto, PageDto, ResourceFilterDto, WhoIsWhoResourceDto} from '../../../model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';
import {ResourceService} from '../../../services/Resource/resource.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-usource-mobileview',
  templateUrl: './usource-mobileview.component.html',
  styleUrls: ['./usource-mobileview.component.sass']
})
export class UsourceMobileviewComponent implements OnInit {

  resources: PageDto<WhoIsWhoResourceDto>;
  resourceCompanyList: CompanyDto[] = [];
  pageIndex: number;
  pageSize: number;
  resourceFilter: ResourceFilterDto;
  fullNameInput = new Subject<string>();
  companyInput = new Subject<string>();
  selectedCompany = 'All';

  constructor(private route: ActivatedRoute, private router: Router,
              private notificationService: NotificationService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.resources = this.route.snapshot.data.data[0];
    this.resourceCompanyList = this.route.snapshot.data.data[1].filter(() => true);
    this.resourceFilter = this.route.snapshot.data.data[2];
    const allCompanies: CompanyDto = {
      company: 'All',
      country: ''
    };
    this.resourceCompanyList.unshift(allCompanies);
    if (this.resourceFilter.companies.length) {
      this.selectedCompany = this.resourceFilter.companies[0];
    }
    this.fullNameInput.pipe(
      debounceTime(environment.searchInputDelay),
      distinctUntilChanged()
    ).subscribe(
      (input: string) => {
        this.pageIndex = 0;
        this.fetchAllResources();
      }
    );

    this.companyInput.pipe(
      debounceTime(environment.searchMultiSelectDelay),
      distinctUntilChanged()
    ).subscribe(
      () => {
        this.pageIndex = 0;
        this.fetchAllResources();
      }
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.pageIndex = 0;
        window.scroll(0, 0);
      }
    });
  }

  /**
   * Fetch all the resources (filtered).
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
   * Change the full name.
   * @param fullName The full name.
   */
  changeFullName(fullName) {
    if (fullName.length > 2 || fullName.length === 0) {
      this.fullNameInput.next(fullName);
    }
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
   * Changes the company.
   */
  changeCompany($event: any) {
    const selectedCompany = $event.target.value;
    this.resourceFilter.companies.length = 0;
    if (selectedCompany) {
      this.resourceFilter.companies.push(selectedCompany);
      this.selectedCompany = selectedCompany;
    }
    this.companyInput.next(this.resourceFilter.companies.toString());
  }

}
