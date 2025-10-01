import { Component, HostListener, Inject, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ActivatedRoute} from '@angular/router';
import {
  SRBoardColumnDto,
  SRBoardFilterDto, SRHiringTeamMemberDto,
  WebSRBoardCandidateDto,
} from '../../model';
import {FilterService} from '../../services/Filter/filter.service';
import {OnBoardingService} from '../../services/OnBoarding/on-boarding.service';
import {NotificationService} from '../../services/notification.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../modal/confirm-modal/confirm-modal.component';
import * as moment from 'moment';
import {DOCUMENT} from '@angular/common';

declare const accentFold: any;

@Component({
  selector: 'app-kanban-dashboard',
  templateUrl: './kanban-dashboard.component.html',
  styleUrls: ['./kanban-dashboard.component.sass']
})
export class KanbanDashboardComponent implements OnInit {

  readonly defaultNumberElementDisplayed = 5;

  currentTab = 'Board';
  search: string;

  companies: string[] = [];
  jobStatuses: string[] = [];
  hiringRoles: SRHiringTeamMemberDto[] = [];
  boardColumns: SRBoardColumnDto[] = [];
  boardColumnsDisplayed: SRBoardColumnDto[] = [];
  candidates: WebSRBoardCandidateDto[] = [];
  displayedCandidates: WebSRBoardCandidateDto[] = [];

  numberElementDisplayed = this.defaultNumberElementDisplayed;

  allStatus = [];

  selectedJobStatus = [];
  selectedCompanies = [];
  selectedRoles = [];

  constructor(private route: ActivatedRoute,
              private notificationService: NotificationService,
              private filterService: FilterService,
              private modalService: NgbModal,
              @Inject(DOCUMENT) private document: Document,
              private onBoardingService: OnBoardingService) {
  }

  srFilter: SRBoardFilterDto = this.filterService.getSRBoardFilterDto();

  ngOnInit() {
    this.companies = this.route.snapshot.data['config'][0];
    this.route.snapshot.data['config'][1].forEach(status => {
      if (status.subStatuses && status.subStatuses.length) {
        status.subStatuses.forEach(subStatus => {
          subStatus.parentStatus = `${status.status} - ${status.hiringProcess}`;
          subStatus.completeName = `${status.status} - ${status.hiringProcess}`;
          this.allStatus.push(subStatus);
        });
      } else {
        status.completeName = `${status.status} - ${status.hiringProcess}`;
        this.allStatus.push(status);
      }
    });
    this.hiringRoles = this.route.snapshot.data['config'][2];
    this.hiringRoles.forEach(hiringRole => {
      hiringRole.memberRoles.forEach(memberRole => {
        // @ts-ignore
        memberRole.fullName = hiringRole.fullName;
        // @ts-ignore
        memberRole.identifier = `${hiringRole.account} - ${memberRole.role}`;
      });
    });
    this.jobStatuses = this.route.snapshot.data['config'][3];
    this.boardColumns = this.route.snapshot.data['data'][0];
    this.srFilter = this.route.snapshot.data['data'][2];
    this.boardColumnsDisplayed = [...this.route.snapshot.data['data'][0]];

    this.candidates = [...this.route.snapshot.data['data'][1]];
    this.displayedCandidates = [...this.route.snapshot.data['data'][1]];

    if (this.srFilter) {
      if (this.srFilter.statuses && this.srFilter.statuses.length) {
        this.selectedJobStatus.push(...this.jobStatuses.filter(status => this.srFilter.statuses.includes(status)));
      }
      if (this.srFilter.companies && this.srFilter.companies.length) {
        this.selectedCompanies.push(...this.companies.filter(company => this.srFilter.companies.includes(company)));
      }
      if (this.srFilter.hiringTeamMembers && this.srFilter.hiringTeamMembers.length) {
        this.selectedRoles = this.srFilter.hiringTeamMembers.map(elt => elt.roles.map(elt2 => {
          return `${elt.account} - ${elt2}`;
          // @ts-ignore
        })).flat();
      }
    }
  }

  /**
   * Listen to the scroll event and when arriving to the end of the page add elements to displayed.
   */
  @HostListener('window:scroll', []) onScroll(): void {
    if (this.document.documentElement.scrollHeight - (this.document.documentElement.scrollTop + window.innerHeight) <= 10) {
      this.numberElementDisplayed += this.defaultNumberElementDisplayed;
    }
  }

  /**
   * Drop the item with drag and drop function.
   * @param event - drop event.
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boardColumns, event.previousIndex, event.currentIndex);
  }

  /**
   * Set the order of the column.
   */
  setOrder() {
    for (let i = 0; i < this.boardColumns.length; i++) {
      this.boardColumns[i].order = i + 1;
    }
  }

  /**
   * Change the value of status in the local storage.
   * @param filter to update.
   */
  changeStatusFilterValue(filter) {
    this.srFilter.statuses = filter;
    this.filterService.setSRBoardFilterDto(this.srFilter);
    this.fetchCandidates();
  }

  /**
   * Change the value of company in the local storage.
   * @param filter to update.
   */
  changeCompanyFilterValue(filter) {
    this.srFilter.companies = filter;
    this.filterService.setSRBoardFilterDto(this.srFilter);
    this.fetchCandidates();
  }

  /**
   * Change the value of hiring team role in the local storage.
   * @param filter to update.
   */
  changeHiringRoleFilterValue(filter) {
    const newFilter = {};
    const filterValues = filter.map(elt => {
      const account = elt.split('-')[0].slice(0, -1);
      const role = elt.split('-')[1].slice(1);
      return {
        account: account,
        roles: [...role]
      };
    });
    filterValues.forEach(({ account, ...rest}) => {
      newFilter[account] = newFilter[account] || { account, roles: [] };
      newFilter[account].roles.push(rest.roles);
    });
    this.srFilter.hiringTeamMembers = Object.values(newFilter);
    this.filterService.setSRBoardFilterDto(this.srFilter);
    this.fetchCandidates();
  }

  /**
   * Add a column in the configuration board.
   */
  addColumn() {
    this.boardColumns.push({
      columnName: '',
    } as SRBoardColumnDto);
  }

  /**
   * Delete a column from the column board. Make a backend call when column exists in database else just delete it
   * from the object.
   *
   * @param column to delete.
   * @param index of the column.
   */
  deleteColumn(column: SRBoardColumnDto, index: number) {
    if (column.id) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = 'Are you sure that you want to delete this column ?';
      modal.componentInstance.confirmationTitle = 'Delete column';
      modal.result.then(result => {
        if (result) {
          this.onBoardingService.deleteBoardColumn(column.id).then(() => {
            this.notificationService.addSuccessToast('Column deleted');
            this.boardColumns.splice(index, 1);
          });
        }
      });
    } else {
      this.boardColumns.splice(index, 1);
    }
  }

  /**
   * Change the status of the column.
   *
   * @param object status to add.
   * @param index of the column.
   */
  changeStatusForColumn(object, index) {
    const statuses = [];
    object.forEach(elt => {
      const statusFound = this.allStatus.filter(status => status.id === elt);
      if (statusFound) {
        statuses.push(...statusFound.map(status => status.id));
      }
    });
    this.boardColumns[index].statuses = statuses;
  }

  /**
   * Update the column configuration board.
   */
  updateBoardColumns() {
    this.setOrder();
    this.onBoardingService.updateBoardColumns(this.boardColumns)
      .then(data => {
        this.notificationService.addSuccessToast('Columns updated');
        this.boardColumns = data;
        this.boardColumnsDisplayed = data;
        this.fetchCandidates();
      });
  }

  /**
   * Count the candidates corresponding to the column.
   * @param statuses to check on.
   */
  countCandidate(statuses) {
    const statusFound = this.allStatus.filter(elt => statuses.includes(elt.id));
    return this.displayedCandidates.filter(candidate =>
      statusFound.some(status =>
        (status.status === candidate.status || status.status === candidate.subStatus)
      )
    ).length;
  }

  /**
   * Filter the candidate to display.
   * @param candidate to check.
   * @param statuses to filter on.
   */
  displayCandidate(candidate: WebSRBoardCandidateDto, statuses) {
    return this.allStatus.some(elt =>
      (elt.status === candidate.status || elt.status === candidate.subStatus) && statuses.includes(elt.id)
    );
  }

  /**
   * Change the tab name in order to not load all the dom.
   * @param tabName the tab name.
   */
  changeTab(tabName) {
    this.currentTab = tabName;
  }

  /**
   * Display the date to the chosen format.
   * @param date to display.
   */
  displayDate(date) {
      return moment(date).format('d/MM/YYYY, h:mm:ss');
  }

  /**
   * Filter the candidates.
   */
  searchForCandidate() {
    if (this.search) {
      const searchLower = this.search.toLowerCase();
      this.displayedCandidates = this.candidates.filter(elt =>
        elt.lastName.toLowerCase().includes(searchLower) ||
        elt.firstName.toLowerCase().includes(searchLower) ||
        elt.jobTitle.toLowerCase().includes(searchLower) ||
        elt.email.toLowerCase().includes(searchLower) ||
        elt.status.toLowerCase().includes(searchLower) ||
        elt.company.toLowerCase().includes(searchLower)
      );
    } else {
      this.displayedCandidates = [...this.candidates];
    }
  }

  /**
   * Search group in subgroup and group
   * @param term to search
   * @param item to search on
   */
  searchHiringTeam(term: string, item: any) {
    term = term.toLowerCase();
    return accentFold(item.role.toLowerCase()).includes(accentFold(term))
      || (item.fullName && accentFold(item.fullName.toLowerCase()).includes(accentFold(term)));
  }

  /**
   * Split the list of displayed candidate according to the statues id.
   * @param candidates to display.
   * @param numbers ids of statuses.
   */
  prepareDisplayedCandidate(candidates: WebSRBoardCandidateDto[], numbers: number[]) {
    return candidates.filter(elt => this.displayCandidate(elt, numbers));
  }

  /**
   * Fetch the candidates for the manager.
   */
  fetchCandidates() {
    this.onBoardingService.getCandidates(this.filterService.getSRBoardFilterDto()).then(data => {
      this.candidates = data;
      this.displayedCandidates = data;
      this.numberElementDisplayed = this.defaultNumberElementDisplayed;
    });
  }
}
