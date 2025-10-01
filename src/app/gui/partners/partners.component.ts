import { Component, OnInit } from '@angular/core';
import {PageDto, PartnerFilterDto, PartnerTableDto} from '../../model';
import {PartnerService} from '../../services/Partner/partner.service';
import {ActivatedRoute} from '@angular/router';
import {FilterService} from '../../services/Filter/filter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PartnerResourcesModalComponent} from '../modal/partner-resources-modal/partner-resources-modal.component';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.sass']
})
export class PartnersComponent implements OnInit {

  partners: PageDto<PartnerTableDto> = {} as PageDto<PartnerTableDto>;
  pageIndex = 0;
  pageSize = 25;
  partnerFilter: PartnerFilterDto = {
    active: null
  };

  readonly types = ['Freelancer', 'Company'];

  constructor(private partnerService: PartnerService,
              private route: ActivatedRoute,
              private filterService: FilterService,
              private modalService: NgbModal) { }

  ngOnInit() {
    const [filter, partnersPage] = this.route.snapshot.data.data;
    this.partners = partnersPage;
    this.partnerFilter = filter;
  }


  /**
   * Fetches all partners based on the filter.
   */
  fetchAllPartners() {
    this.partnerService.getPartners(this.partnerFilter, this.pageSize, this.pageIndex)
      .then(result => this.partners = result);
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.changePage(0);
  }

  /**
   * Change the index value of the page
   * @param pageIndex the new value
   */
  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.fetchAllPartners();
  }

  /**
   * Change the page size.
   * @param pageSize the page size to set.
   */
  changePageSize(pageSize: number) {
    this.pageSize = pageSize;
  }

  /**
   * Checks if the partner is active or not.
   * @param partner the partner to check.
   */
  isPartnerActive(partner: PartnerTableDto): boolean {
    return partner.resources.length && partner.resources.some(resource => resource.active);
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.partnerFilter.sortingRow === event) {
      this.partnerFilter.ascending = !this.partnerFilter.ascending;
    } else {
      this.partnerFilter.sortingRow = event;
      this.partnerFilter.ascending = true;
    }
    this.pageIndex = 0;
    this.fetchAllPartners();
  }

  /**
   * Open the resource modal.
   * @param resources the resources to display.
   */
  openResourceModal(resources: any[]): void {
    const modalRef = this.modalService.open(PartnerResourcesModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.resources = resources;
  }
}
