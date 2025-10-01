import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyDto, WrapperEJobTypeDto} from '../../model';
import {CompanyService} from '../../services/Company/company.service';
import {ResourceService} from '../../services/Resource/resource.service';
import {ConnectedUserNotifierService} from '../../services/connected-user-notifier.service';
import {UserService} from '../../services/User/user.service';
import {ExportResourcesService} from '../../services/ExportResources/export-resources.service';
import {NotificationService} from '../../services/notification.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CheckSanityComponent} from '../../gui/modal/check-sanity/check-sanity.component';
import {PreferencesComponent} from '../../gui/modal/preferences/preferences.component';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  selectedCompanies: string[] = [];
  selectedTypes: string[] = [];

  @ViewChild('clickButton') buttonCloseMenu: ElementRef;
  resourceTypeList: WrapperEJobTypeDto[] = [];
  showAdminMenu: boolean;
  showOnBoardingMenu: boolean;
  isAdministrator: boolean;
  isAdminByEntity: boolean;
  isReferralManager: boolean;
  isRead: boolean;
  isBadgeRead: boolean;
  isAdminOrReadGlobal: boolean;
  isManagerOnBoarding: boolean;
  isEntityManager: boolean;
  isRecruiter: boolean;
  resourceCompanyList: CompanyDto[] = [];
  isUsourcePanelExpanded: boolean = true;
  isAdminPanelExpanded: boolean = true;
  isOnboardingPanelExpanded: boolean = true;

  constructor(private route: ActivatedRoute, public router: Router, private resourceService: ResourceService,
              private companyService: CompanyService, private notifier: ConnectedUserNotifierService,
              private userService: UserService, private exportService: ExportResourcesService,
              private notificationService: NotificationService, private modalService: NgbModal) {
  }


  async ngOnInit() {
    this.companyService.getCompanies().then((data: CompanyDto[]) => {
      this.resourceCompanyList = data;
    });

    this.resourceService.getJobTypes().then((data: WrapperEJobTypeDto[]) => {
      this.resourceTypeList = data;
    });

    this.showAdminMenu = await this.userService.isAdministrationMenuViewable();

    this.userService.isAdministrator().then((data: boolean) => {
      this.isAdministrator = data;
    });

    this.userService.hasAdminRole().then((data: boolean) => {
      this.isAdminByEntity = data;
    })

    this.userService.hasReadRole().then((data: boolean) => {
      this.isRead = data;
    });

    this.userService.isReadBadge().then((data: boolean) => {
      this.isBadgeRead = data;
    })

    this.userService.isReferralManager().then((data: boolean) => {
      this.isReferralManager = data;
    })

    this.userService.isOnBoardingMenuViewable().then((data: boolean) => {
      this.showOnBoardingMenu = data;
    });

    this.userService.isManagerOnBoarding().then((data: boolean) => {
      this.isManagerOnBoarding = data;
    });

    this.userService.isEntityManager().then((data: boolean) => {
      this.isEntityManager = data;
    });

    this.userService.isRecruiter().then((data: boolean) => {
      this.isRecruiter = data;
    });

    // Checks admin or read global
    this.userService.isAdminRead().then((data: boolean) => {
      this.isAdminOrReadGlobal = data;
    });
  }

  close() {
    (<any>window).zeusCloseSidemenu('sidepanel1');
  }

  toggleUsourcePanel() {
    this.isUsourcePanelExpanded = !this.isUsourcePanelExpanded;
  }

  toggleAdminPanel() {
    this.isAdminPanelExpanded = !this.isAdminPanelExpanded;
  }

  toggleOnboardingPanel() {
    this.isOnboardingPanelExpanded = !this.isOnboardingPanelExpanded;
  }

  /**
   * Return true if the user has at least selected one company or one type otherwise return  false
   * @return a boolean value
   */
  isExportable(): boolean {
    return this.selectedCompanies != null && this.selectedCompanies.length > 0
      && this.selectedTypes != null && this.selectedTypes.length > 0;
  }

  /**
   * Allows to export the employees
   */
  export() {
    this.exportService.export(this.selectedCompanies, this.selectedTypes)
      .then(() => {
        this.notificationService.addSuccessToast('Export file successfully created');
      });
  }

  /**
   * Change the companies selected
   */
  changeValueCompany(list) {
    this.selectedCompanies = list;
  }

  /**
   * Change the types selected
   */
  changeValueTypes(list) {
    this.selectedTypes = list;
  }

  /**
   * Open check sanity modal
   */
  openCheckSanityModal() {
    const modal = this.modalService.open(CheckSanityComponent, {backdrop: 'static', centered: true});
  }

  /**
   * Open preference modal
   */
  openPreferencesModal() {
    Promise.all([
      this.userService.getHomePagePreferences(),
      this.userService.getUserPreferences(),
    ]).then( res => {
      const modal = this.modalService.open(PreferencesComponent, {backdrop: 'static', centered: true, size: 'lg'});
      modal.componentInstance.resourceCompanyList = res[0].companyDtos;
      modal.componentInstance.homePageList = res[0].homepagePreferences;
      modal.componentInstance.userPreferenceDto = res[1];
    });
  }
}
