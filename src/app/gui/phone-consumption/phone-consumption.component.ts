import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  CompanyDto,
  EPhoneConsumptionStatus,
  FullResourceDto,
  PageDto,
  PhoneConsumptionDto,
  PhoneConsumptionFilterDto, PhoneFixedCostDto, PhoneFixedCostFilterDto,
  UserAppDto
} from '../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {ConnectedUserNotifierService} from '../../services/connected-user-notifier.service';
import {UserService} from '../../services/User/user.service';
import {FilterService} from '../../services/Filter/filter.service';
import {ExportResourcesService} from '../../services/ExportResources/export-resources.service';
import {PhoneConsumptionService} from '../../services/PhoneConsumption/phone-consumption.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CostExtractComponent} from './cost-extract/cost-extract.component';
import {LoadingService} from '../../services/loading.service';
import {filter} from 'rxjs/operators';
import {ConsumptionTabComponent} from './consumption-tab/consumption-tab.component';

@Component({
  selector: 'app-phone-consumption',
  templateUrl: './phone-consumption.component.html',
  styleUrls: ['./phone-consumption.component.sass']
})
export class PhoneConsumptionComponent implements OnInit {

  phoneConsumptionPage: PageDto<PhoneConsumptionDto>;
  pageIndex = 0;
  pageSize = 25;
  phoneConsumptionStatusList: EPhoneConsumptionStatus[] = [];
  phoneConsumptionPeriodList: string[] = [];
  resourceCompanyList: CompanyDto[] = [];
  administratedCompanyList: CompanyDto[] = [];
  isUserAdministrator: boolean;


  phoneConsumptionFilter: PhoneConsumptionFilterDto;

  phoneFixedCostPage: PageDto<PhoneFixedCostDto>;
  pageFixedCostIndex = 0;
  pageFixedCostSize = 25;
  phoneFixedCostPeriodList: string[] = [];
  phoneFixedCostFilter: PhoneFixedCostFilterDto;

  @ViewChild(ConsumptionTabComponent) consumptionTab: ConsumptionTabComponent;

  user: FullResourceDto;
  userPrivileges: UserAppDto;

  constructor(private route: ActivatedRoute, private router: Router, private notificationService: NotificationService,
              private phoneConsumptionService: PhoneConsumptionService,
              private notifier: ConnectedUserNotifierService, private userService: UserService,
              private filterService: FilterService, private exportService: ExportResourcesService,
              private modalService: NgbModal, private loadingService: LoadingService,
              public cd: ChangeDetectorRef) {
    this.user = this.notifier.getUser();
    this.userService.getAuthenticatedUser().then((data) => {
        this.userPrivileges = data;
      }
    );
  }

  ngOnInit() {
    const data = this.route.snapshot.data.data;
    this.phoneConsumptionPage = data[0];
    this.resourceCompanyList = data[1];
    this.phoneConsumptionStatusList = data[2];
    this.phoneConsumptionFilter = data[3];
    this.phoneConsumptionPeriodList = data[4];
    this.phoneFixedCostPage = data[5];
    this.phoneFixedCostPeriodList = data[6];
    this.phoneFixedCostFilter = data[7];
    this.administratedCompanyList = data[9];
    this.route.queryParams.pipe(filter(params => params.resource)).subscribe(
      () => window.history.replaceState(null, null, window.location.href.split('?')[0])
    );
  }

  /**
   * Open export modal
   */
  openExportModal() {
    const modalRef = this.modalService.open(
      CostExtractComponent, {backdrop: 'static', centered: true}
    );
    modalRef.componentInstance.companyList = this.resourceCompanyList;
  }

  /**
   * Is consumption tab active
   */
  isConsumptionTabActive() {
    return this.consumptionTab && document.getElementById('consumption-tab').classList.contains('active');
  }

  /**
   * Detect changes after click
   */
  detectChanges() {
    setTimeout(() => this.cd.detectChanges());
  }
}
