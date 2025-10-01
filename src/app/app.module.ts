import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HeaderComponent} from './common/header/header.component';
import {MenuComponent} from './common/menu/menu.component';
import {MainComponent} from './common/main/main.component';
import {BreadcrumbComponent} from './common/breadcrumb/breadcrumb.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastyModule} from 'ng2-toasty';
import {ErrorComponent} from './gui/error/error.component';
import {ErrorResolver} from './resolvers/ErrorResolver';
import {RequestInterceptorService} from './request-interceptor.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {LoadingService} from './services/loading.service';
import {USourceComponent} from './gui/usource/usource.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {USourceResolver} from './resolvers/USourceResolver';
import {LimitToPipe} from './pipes/limit-to.pipe';
import {EditResourceComponent} from './gui/edit-resource/edit-resource.component';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImageCropperModule} from 'ngx-image-cropper';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ResourcesListComponent} from './gui/resources-list/resources-list.component';
import {IResponsiveConfig, ResponsiveModule} from 'ngx-responsive';
import {UsourceMobileviewComponent} from './gui/usource/usource-mobileview/usource-mobileview.component';
import {UsourceDesktopviewComponent} from './gui/usource/usource-desktopview/usource-desktopview.component';
import {ResourcesListResolver} from './resolvers/ResourcesListResolver';
import {EditResolver} from './resolvers/EditResolver';
import {EditCandidateResolver} from './resolvers/EditCandidateResolver';
import {NgbDateCustomParserFormatter} from './utils/DateFormatter';
import {FormDataResolver} from './resolvers/FormDataResolver';
import {EditProfileComponent} from './gui/modal/edit-profile/edit-profile.component';
import {CanDeactivateEditGuard} from './guards/can-deactivate-edit/can-deactivate-edit-guard.service';
import {CandidateResolver} from './resolvers/CandidateResolver';
import {ManageCandidatesComponent} from './gui/manage-candidates/manage-candidates.component';
import {DailyEmailsComponent} from './gui/daily-emails/daily-emails.component';
import {CandidatesListResolver} from './resolvers/CandidatesListResolver';
import {EditCandidateComponent} from './gui/edit-candidate/edit-candidate.component';
import {StartPageGuard} from './guards/can-deactivate-edit/StartPageGuard';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {ReferrerResolver} from './resolvers/ReferrerResolver';
import {LargePictureResolver} from './resolvers/LargePictureResolver';
import {CroppedPictureResolver} from './resolvers/CroppedPictureResolver';
import {AvoidRedirectGuard} from './guards/can-deactivate-edit/AvoidRedirectGuard';
import {EmployeeListResolver} from './resolvers/EmployeeListResolver';
import {ConfirmationModalComponent} from './gui/modal/confirmation-modal/confirmation-modal.component';
import {ChurnCandidateComponent} from './gui/edit-resource/churn-candidate/churn-candidate.component';
import {CountriesResolver} from './resolvers/CountriesResolver';
import {HolarisDeleteComponent} from './gui/modal/holaris-delete/holaris-delete.component';
import {ConvertUnderscoreToSpacePipe} from './pipes/convertUnderscoreToSpace.pipe';
import {ForceCreateComponent} from './gui/modal/force-create/force-create.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {MultiSelectComponent} from './gui/multi-select/multi-select.component';
import {HardwareRequestComponent} from './gui/hardware-request/hardware-request.component';
import {HardwareRequestResolver} from './resolvers/HardwareRequestResolver';
import {CheckSanityComponent} from './gui/modal/check-sanity/check-sanity.component';
import {ManagerDashboardComponent} from './gui/manager-dashboard/manager-dashboard.component';
import {KanbanDashboardComponent} from './gui/kanban-dashboard/kanban-dashboard.component';
import {RecruiterDashboardComponent} from './gui/recruiter-dashboard/recruiter-dashboard.component';
import {EmployeeResolver} from './resolvers/EmployeeResolver';
import {InductionResponsibleResolver} from './resolvers/InductionResponsibleResolver';
import {ResponsibleAtArhsComponent} from './gui/responsible-at-arhs/responsible-at-arhs.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SmartRecruiterBoardConfigResolver} from './resolvers/SmartRecruiterBoardConfigResolver';
import {SmartRecruiterBoardResolver} from './resolvers/SmartRecruiterBoardResolver';
import {ConfirmModalComponent} from './gui/modal/confirm-modal/confirm-modal.component';
import {ManagerBoardResolver} from './resolvers/ManagerBoardResolver';
import {OnboardeeDetailsComponent} from './gui/manager-dashboard/onboardee-details/onboardee-details.component';
import {OnboardeeDetailsResolver} from './resolvers/OnboardeeDetailsResolver';
import {RecruiterDashboardConfigResolver} from './resolvers/RecruiterDashboardConfigResolver';
import {RecruiterDashboardResolver} from './resolvers/RecruiterDashboardResolver';
import {RecruiterRequestComponent} from './gui/recruiter-dashboard/recruiter-request/recruiter-request.component';
import {EmployeeOfferFormComponent} from './gui/recruiter-dashboard/recruiter-request/employee-offer-form/employee-offer-form.component';
import {DragDropDirective} from './validators/DragDropDirective';
// tslint:disable-next-line
import {FreelancerOfferFormComponent} from './gui/recruiter-dashboard/recruiter-request/freelancer-offer-form/freelancer-offer-form.component';
import {SendMailComponent} from './gui/modal/send-mail/send-mail.component';
import {CandidateOfferCreateResolver} from './resolvers/CandidateOfferCreateResolver';
import {BadgeManagementComponent} from './gui/badge-management/badge-management.component';
import {BadgeListResolver} from './resolvers/BadgeListResolver';
import {AccessTypeResolver} from './resolvers/AccessTypeResolver';
import {AvailableBadgesResolver} from './resolvers/AvailableBadgesResolver';
import {CandidateOfferUpdateResolver} from './resolvers/CandidateOfferUpdateResolver';
import {AlarmCodeManagementComponent} from './gui/alarm-code-management/alarm-code-management.component';
import {AlarmCodeListResolver} from './resolvers/AlarmCodeListResolver';
import {EditAlarmCodeComponent} from './gui/modal/edit-badge/edit-alarm-code.component';
import { PreferencesComponent } from './gui/modal/preferences/preferences.component';
import {KeyListenerDirective} from './directives/KeyListener/key-listener.directive';
import { EditPhoneComponent } from './gui/modal/edit-phone/edit-phone.component';
import {FilterPipe} from './pipes/filter.pipe';
import { PhoneConsumptionComponent } from './gui/phone-consumption/phone-consumption.component';
import {PhoneConsumptionResolver} from './resolvers/PhoneConsumptionResolver';
import { CostExtractComponent } from './gui/phone-consumption/cost-extract/cost-extract.component';
import {CurrencyFormatterPipe} from './pipes/currency-formatter.pipe';
import { WorkingCertificateComponent } from './gui/modal/working-certificate/working-certificate.component';
import { ManagePhoneNumbersComponent } from './gui/manage-phone-numbers/manage-phone-numbers.component';
import { FixedCostTabComponent } from './gui/phone-consumption/fixed-cost-tab/fixed-cost-tab.component';
import { ConsumptionTabComponent } from './gui/phone-consumption/consumption-tab/consumption-tab.component';
import { EditFixedCostComponent } from './gui/modal/edit-fixed-cost/edit-fixed-cost.component';
import {LightFormDataResolver} from './resolvers/LightFormDataResolver';
import {TitlesResolver} from './resolvers/TitlesResolver';
import { PhoneManagementComponent } from './gui/manage-phone/phone-management.component';
import { PhoneListResolver } from './resolvers/PhoneListResolver';
import { OverviewReferrerComponent } from './gui/overview-referrer/overview-referrer.component';
import {SortComponent} from "./gui/data-table/sort/sort.component";
import {PaginationComponent} from "./gui/data-table/pagination/pagination.component";
import {OverviewReferrerResolver} from "./resolvers/OverviewReferrerResolver";
import { EditReferrerModalComponent } from './gui/modal/edit-referrer-modal/edit-referrer-modal.component';
import {ModalUtils} from "./utils/ModalUtils";
import { HardwareFormComponent } from './gui/hardware-form/hardware-form.component';
import { LaptopFormComponent } from './gui/laptop-form/laptop-form.component';
import { JobPositionSelectComponent } from './gui/job-position-select/job-position-select.component';
import { FileImportTabComponent } from './gui/phone-consumption/file-import-tab/file-import-tab.component';
import {IsAdminOfCandidateResolver} from './resolvers/IsAdminOfCandidateResolver';
import {CompaniesResolver} from './resolvers/CompaniesResolver';
import {WorkingRemoteResolver} from "./resolvers/WorkingRemoteResolver";
import {WorkPermitComponent} from "./gui/work-permit/work-permit.component";
import {
  FrontierWorkerDeclarationComponent
} from './gui/frontier-worker-declaration/frontier-worker-declaration.component';
import { PartnersComponent } from './gui/partners/partners.component';
import { EditPartnersComponent } from './gui/edit-partners/edit-partners.component';
import {PartnerResolver} from './resolvers/PartnerResolver';
import {PartnerListResolver} from './resolvers/PartnerListResolver';
import { PartnerResourcesModalComponent } from './gui/modal/partner-resources-modal/partner-resources-modal.component';

const config: IResponsiveConfig = {
  breakPoints: {
    xs: { max: 600 },
    sm: { min: 601, max: 959 },
    md: { min: 960, max: 1279 },
    lg: { min: 1280, max: 1919 },
    xl: { min: 1920 }
  },
  debounceTime: 100
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    MainComponent,
    BreadcrumbComponent,
    ErrorComponent,
    USourceComponent,
    LimitToPipe,
    ConvertUnderscoreToSpacePipe,
    EditResourceComponent,
    ResourcesListComponent,
    UsourceMobileviewComponent,
    UsourceDesktopviewComponent,
    EditProfileComponent,
    ManageCandidatesComponent,
    DailyEmailsComponent,
    EditProfileComponent,
    EditCandidateComponent,
    ConfirmationModalComponent,
    ChurnCandidateComponent,
    HolarisDeleteComponent,
    ForceCreateComponent,
    MultiSelectComponent,
    HardwareRequestComponent,
    ManagerDashboardComponent,
    KanbanDashboardComponent,
    RecruiterDashboardComponent,
    ResponsibleAtArhsComponent,
    ConfirmModalComponent,
    OnboardeeDetailsComponent,
    RecruiterRequestComponent,
    EmployeeOfferFormComponent,
    FreelancerOfferFormComponent,
    BadgeManagementComponent,
    SendMailComponent,
    DragDropDirective,
    CheckSanityComponent,
    AlarmCodeManagementComponent,
    EditAlarmCodeComponent,
    PreferencesComponent,
    KeyListenerDirective,
    EditPhoneComponent,
    FilterPipe,
    PhoneConsumptionComponent,
    CostExtractComponent,
    CurrencyFormatterPipe,
    WorkingCertificateComponent,
    ManagePhoneNumbersComponent,
    FixedCostTabComponent,
    ConsumptionTabComponent,
    EditFixedCostComponent,
    OverviewReferrerComponent,
    SortComponent,
    PaginationComponent,
    EditReferrerModalComponent,
    EditFixedCostComponent,
    PhoneManagementComponent,
    HardwareFormComponent,
    LaptopFormComponent,
    JobPositionSelectComponent,
    FileImportTabComponent,
    WorkPermitComponent,
    FrontierWorkerDeclarationComponent,
    PartnersComponent,
    EditPartnersComponent,
    PartnerResourcesModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    NgxPaginationModule,
    BrowserAnimationsModule,
    NgbModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot(),
    ResponsiveModule.forRoot(config),
    Ng2AutoCompleteModule,
    NgSelectModule,
    DragDropModule
  ],
  providers: [
    ErrorResolver,
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    LoadingService,
    USourceResolver,
    ResourcesListResolver,
    EditResolver,
    EditCandidateResolver,
    FormDataResolver,
    LightFormDataResolver,
    TitlesResolver,
    CandidateResolver,
    CanDeactivateEditGuard,
    CandidatesListResolver,
    CanDeactivateEditGuard,
    StartPageGuard,
    AvoidRedirectGuard,
    ReferrerResolver,
    LargePictureResolver,
    CroppedPictureResolver,
    EmployeeListResolver,
    CountriesResolver,
    HardwareRequestResolver,
    EmployeeResolver,
    InductionResponsibleResolver,
    SmartRecruiterBoardConfigResolver,
    SmartRecruiterBoardResolver,
    ManagerBoardResolver,
    OnboardeeDetailsResolver,
    RecruiterDashboardConfigResolver,
    RecruiterDashboardResolver,
    CandidateOfferCreateResolver,
    CandidateOfferUpdateResolver,
    BadgeListResolver,
    PhoneListResolver,
    AccessTypeResolver,
    AvailableBadgesResolver,
    AlarmCodeListResolver,
    PhoneConsumptionResolver,
    OverviewReferrerResolver,
    ModalUtils,
    IsAdminOfCandidateResolver,
    CompaniesResolver,
    WorkingRemoteResolver,
    PartnerResolver,
    PartnerListResolver
  ],
  entryComponents: [
    EditProfileComponent,
    ConfirmationModalComponent,
    HolarisDeleteComponent,
    ForceCreateComponent,
    ConfirmModalComponent,
    SendMailComponent,
    CheckSanityComponent,
    EditAlarmCodeComponent,
    PreferencesComponent,
    EditPhoneComponent,
    CostExtractComponent,
    WorkingCertificateComponent,
    EditFixedCostComponent,
    EditReferrerModalComponent,
    PartnerResourcesModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
