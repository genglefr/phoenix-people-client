import { Component, OnInit } from '@angular/core';
import {
  AdministrationResourceFilterDto,
  CompanyDto, FilterDto,
  PageDto,
  PageResourceDto,
  ReferredDto, ReferredFilterDto, ResourceFullNameAndAccountDto, ShortResourceDto,
  WrapperEJobTypeDto
} from "../../model";
import {Pagination} from "../../../environments/config";
import {ActivatedRoute} from "@angular/router";
import {ReferrersService} from "../../services/Referrer/referrers.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditReferrerModalComponent} from "../modal/edit-referrer-modal/edit-referrer-modal.component";
import {ResourceService} from "../../services/Resource/resource.service";

@Component({
  selector: 'app-overview-referrer',
  templateUrl: './overview-referrer.component.html',
  styleUrls: ['./overview-referrer.component.sass']
})
export class OverviewReferrerComponent implements OnInit {

  referredPage: PageDto<ReferredDto>;
  pagination: Pagination;
  resourceTypeList: WrapperEJobTypeDto[] = [];
  resourceCompanyList: CompanyDto[] = [];
  isUserAdministrator: boolean;

  referredFilter: ReferredFilterDto;

  resources: ShortResourceDto[] = [];


  constructor(
    private route: ActivatedRoute,
    private referrersService: ReferrersService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    const data = this.route.snapshot.data.data;
    this.referredPage = data[0];
    this.resourceCompanyList = data[1];
    this.resourceTypeList = data[2];
    this.referredFilter = data[3];
  }

  /**
   * Update pagination and fetch new tasks according the pagination
   * @param pagination
   */
  changePagination(pagination: Pagination): void {
    this.pagination = pagination;
    this.searchWithFilter();
  }

  /**
   * Change column to sort
   * @param filter
   */
  changeSort(filter: FilterDto) {
    this.referredFilter.sortingRow = filter.sortingRow;
    this.referredFilter.ascending = filter.ascending;
    this.searchWithFilter();
  }

  /**
   * Change the entity.
   */
  changeEntity(filter) {
    this.referredFilter.companies = filter;
  }

  /**
   * Change the type.
   */
  changeType(filter) {
    this.referredFilter.types = filter;
  }


  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.referrersService.getReferredPage(this.referredFilter, this.pagination)
      .then(page => this.referredPage = page)
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
   * Open the edit referrer modal
   * @param referred
   */
  openEditModal(referred: ReferredDto){
    Promise.all([
      (this.resources.length > 0) ? Promise.resolve(this.resources) : this.referrersService.getReferrers()
    ]).then(([res]) => {
      this.resources = res;

      const modalRef = this.modalService.open(
        EditReferrerModalComponent, {centered: true, keyboard: false, backdrop: 'static'}
      );
      modalRef.componentInstance.referred = Object.assign({},referred);
      modalRef.componentInstance.resources = res;

      modalRef.result.then((
        value => {
          if (value) {
            this.pagination = new Pagination();
            this.searchWithFilter();
          }
        }
      ))
    });
  }

}
