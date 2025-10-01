import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {USourceComponent} from './gui/usource/usource.component';
import {USourceResolver} from './resolvers/USourceResolver';
import {ErrorComponent} from './gui/error/error.component';
import {ErrorResolver} from './resolvers/ErrorResolver';
import {EditResourceComponent} from './gui/edit-resource/edit-resource.component';
import {ResourcesListComponent} from './gui/resources-list/resources-list.component';
import {UsourceMobileviewComponent} from './gui/usource/usource-mobileview/usource-mobileview.component';
import {UsourceDesktopviewComponent} from './gui/usource/usource-desktopview/usource-desktopview.component';
import {ResourcesListResolver} from './resolvers/ResourcesListResolver';
import {EditResolver} from './resolvers/EditResolver';
import {EditCandidateResolver} from './resolvers/EditCandidateResolver';
import {FormDataResolver} from './resolvers/FormDataResolver';
import {CanDeactivateEditGuard} from './guards/can-deactivate-edit/can-deactivate-edit-guard.service';
import {EditCandidateComponent} from './gui/edit-candidate/edit-candidate.component';
import {ManageCandidatesComponent} from './gui/manage-candidates/manage-candidates.component';
import {DailyEmailsComponent} from './gui/daily-emails/daily-emails.component';
import {CandidateResolver} from './resolvers/CandidateResolver';
import {CandidatesListResolver} from './resolvers/CandidatesListResolver';
import {StartPageGuard} from './guards/can-deactivate-edit/StartPageGuard';
import {ReferrerResolver} from './resolvers/ReferrerResolver';
import {LargePictureResolver} from './resolvers/LargePictureResolver';
import {CroppedPictureResolver} from './resolvers/CroppedPictureResolver';
import {AvoidRedirectGuard} from './guards/can-deactivate-edit/AvoidRedirectGuard';
import {EmployeeListResolver} from './resolvers/EmployeeListResolver';
import {CountriesResolver} from './resolvers/CountriesResolver';
import {HardwareRequestComponent} from './gui/hardware-request/hardware-request.component';
import {HardwareRequestResolver} from './resolvers/HardwareRequestResolver';
import {ManagerDashboardComponent} from './gui/manager-dashboard/manager-dashboard.component';
import {KanbanDashboardComponent} from './gui/kanban-dashboard/kanban-dashboard.component';
import {RecruiterDashboardComponent} from './gui/recruiter-dashboard/recruiter-dashboard.component';
import {EmployeeResolver} from './resolvers/EmployeeResolver';
import {InductionResponsibleResolver} from './resolvers/InductionResponsibleResolver';
import {SmartRecruiterBoardConfigResolver} from './resolvers/SmartRecruiterBoardConfigResolver';
import {SmartRecruiterBoardResolver} from './resolvers/SmartRecruiterBoardResolver';
import {ManagerBoardResolver} from './resolvers/ManagerBoardResolver';
import {OnboardeeDetailsComponent} from './gui/manager-dashboard/onboardee-details/onboardee-details.component';
import {OnboardeeDetailsResolver} from './resolvers/OnboardeeDetailsResolver';
import {RecruiterDashboardConfigResolver} from './resolvers/RecruiterDashboardConfigResolver';
import {RecruiterDashboardResolver} from './resolvers/RecruiterDashboardResolver';
import {RecruiterRequestComponent} from './gui/recruiter-dashboard/recruiter-request/recruiter-request.component';
import {CandidateOfferCreateResolver} from './resolvers/CandidateOfferCreateResolver';
import {BadgeManagementComponent} from './gui/badge-management/badge-management.component';
import {BadgeListResolver} from './resolvers/BadgeListResolver';
import {AccessTypeResolver} from './resolvers/AccessTypeResolver';
import {AvailableBadgesResolver} from './resolvers/AvailableBadgesResolver';
import {CandidateOfferUpdateResolver} from './resolvers/CandidateOfferUpdateResolver';
import {AlarmCodeListResolver} from './resolvers/AlarmCodeListResolver';
import {AlarmCodeManagementComponent} from './gui/alarm-code-management/alarm-code-management.component';
import {PhoneConsumptionComponent} from './gui/phone-consumption/phone-consumption.component';
import {PhoneConsumptionResolver} from './resolvers/PhoneConsumptionResolver';
import {LightFormDataResolver} from './resolvers/LightFormDataResolver';
import {TitlesResolver} from './resolvers/TitlesResolver';
import {OverviewReferrerComponent} from "./gui/overview-referrer/overview-referrer.component";
import {OverviewReferrerResolver} from "./resolvers/OverviewReferrerResolver";
import { PhoneManagementComponent } from './gui/manage-phone/phone-management.component';
import { PhoneListResolver } from './resolvers/PhoneListResolver';
import {IsAdminOfCandidateResolver} from './resolvers/IsAdminOfCandidateResolver';
import {CompaniesResolver} from './resolvers/CompaniesResolver';
import {WorkingRemoteResolver} from "./resolvers/WorkingRemoteResolver";
import {PartnersComponent} from './gui/partners/partners.component';
import {EditPartnersComponent} from './gui/edit-partners/edit-partners.component';
import {PartnerResolver} from './resolvers/PartnerResolver';
import {PartnerListResolver} from './resolvers/PartnerListResolver';

const routes: Routes = [
  {
    path: '',
    component: USourceComponent,
    resolve: {data: USourceResolver},
    canActivate: [StartPageGuard],
    data: {'breadcrumb': ''},
    children: [
      {
        path: '',
        component: UsourceDesktopviewComponent,
        data: {'breadcrumb': 'Who is who'},
      },
      {
        path: '',
        component: UsourceMobileviewComponent,
        data: {'breadcrumb': 'Who is who'},
      }
    ],
    pathMatch: 'full'
  },
  {
    path: 'usource',
    redirectTo: ''
  },
  {
    path: 'administration/candidates',
    component: ManageCandidatesComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {formData: LightFormDataResolver, candidatesData: CandidatesListResolver},
    data: {'breadcrumb': 'Administration/Manage candidates'}
  },
  {
    path: 'administration',
    redirectTo: 'administration/resources',
    pathMatch: 'full'
  },
  {
    path: 'administration/manage-resources',
    redirectTo: 'administration/resources'
  },
  {
    path: 'administration/manage-candidates',
    redirectTo: 'administration/candidates'
  },
  {
    path: 'administration/resources',
    component: ResourcesListComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {data: ResourcesListResolver},
    data: {'breadcrumb': 'Administration/Manage resources'},
  },
  {
    path: 'administration/resources/new',
    component: EditResourceComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      formData: FormDataResolver,
      largePic: LargePictureResolver,
      croppedPic: CroppedPictureResolver,
      countries: CountriesResolver,
      employees: EmployeeResolver,
      workingRemote: WorkingRemoteResolver
    },
    data: {'breadcrumb': 'Administration/Manage resources/New', 'type': 'new'}
  },
  {
    path: 'administration/resources/:account',
    component: EditResourceComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      rsc: EditResolver,
      formData: FormDataResolver,
      largePic: LargePictureResolver,
      croppedPic: CroppedPictureResolver,
      countries: CountriesResolver,
      employees: EmployeeResolver,
      accessTypes: AccessTypeResolver,
      availableBadges: AvailableBadgesResolver,
      workingRemote: WorkingRemoteResolver
    },
    data: {'breadcrumb': 'Administration/Manage resources/', 'type': 'edit'}
  },
  {
    path: 'administration/candidates/new',
    component: EditCandidateComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      formData: FormDataResolver,
      largePic: LargePictureResolver,
      croppedPic: CroppedPictureResolver,
      countries: CountriesResolver,
      employees: EmployeeResolver,
      isAdmin: IsAdminOfCandidateResolver,
      workingRemote: WorkingRemoteResolver
    },
    data: {'breadcrumb': 'Administration/Manage candidates/New', 'type': 'new'}
  },
  {
    path: 'administration/candidates/:account',
    component: EditCandidateComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      rsc: EditCandidateResolver,
      formData: FormDataResolver,
      largePic: LargePictureResolver,
      croppedPic: CroppedPictureResolver,
      countries: CountriesResolver,
      employees: EmployeeResolver,
      inductionResponsible: InductionResponsibleResolver,
      accessTypes: AccessTypeResolver,
      availableBadges: AvailableBadgesResolver,
      isAdmin: IsAdminOfCandidateResolver,
      workingRemote: WorkingRemoteResolver
    },
    data: {'breadcrumb': 'Administration/Manage candidates/', 'type': 'edit'}
  },
  {
    path: 'administration/badge/management',
    component: BadgeManagementComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: BadgeListResolver
    },
    data: {'breadcrumb': 'Administration/Manage badges', 'type': 'edit'}
  },
    {
    path: 'administration/phone/management',
    component: PhoneManagementComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: PhoneListResolver
    },
    data: {'breadcrumb': 'Administration/Manage phones', 'type': 'edit'}
  },
  {
    path: 'administration/referrer',
    component: OverviewReferrerComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: OverviewReferrerResolver
    },
    data: {'breadcrumb': 'Administration/Overview referrer', 'type': 'edit'}
  },
  {
    path: 'administration/alarm-codes/management',
    component: AlarmCodeManagementComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: AlarmCodeListResolver
    },
    data: {'breadcrumb': 'Administration/Alarm codes'}
  },
  {
    path: 'administration/phone-consumption/management',
    component: PhoneConsumptionComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: PhoneConsumptionResolver
    },
    data: {'breadcrumb': 'Administration/Phone consumption'}
  }, {
    path: 'administration/partners',
    component: PartnersComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {data: PartnerListResolver},
    data: {'breadcrumb': 'Administration/Manage partners'},
  }, {
    path: 'administration/manage-partners',
    redirectTo: 'administration/partners'
  },
  {
    path: 'administration/partners/new',
    component: EditPartnersComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {data: PartnerResolver},
    data: {'breadcrumb': 'Administration/Manage partners/Create partner', 'type': 'new'},
  }, {
    path: 'administration/partners/:id',
    component: EditPartnersComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {data: PartnerResolver},
    data: {'breadcrumb': 'Administration/Manage partners/Edit partner', 'type': 'edit'},
  },
  {
    path: 'dailyEmails',
    component: DailyEmailsComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      candidatesData: CandidateResolver,
      referrersData: ReferrerResolver,
      employee: EmployeeListResolver
    },
    data: {'breadcrumb': 'Administration/Daily emails', 'type': 'edit'}
  },
  {
    path: 'hardware-request',
    component: HardwareRequestComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      formData: LightFormDataResolver,
      hardware: HardwareRequestResolver
    },
    data: {'breadcrumb': 'Administration/Hardware request'}
  },
  {
    path: 'onboarding',
    redirectTo: 'onboarding/recruiter-dashboard'
  },
  {
    path: 'onboarding/manager-dashboard',
    component: ManagerDashboardComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      data: ManagerBoardResolver
    },
    data: {'breadcrumb': 'Onboarding/Manager dashboard'}
  },
  {
    path: 'onboarding/manager-dashboard/:account',
    component: OnboardeeDetailsComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      rsc: OnboardeeDetailsResolver,
      employees: EmployeeResolver
    },
    data: {'breadcrumb': 'Onboarding/Manager dashboard/'}
  },
  {
    path: 'onboarding/kanban-dashboard',
    component: KanbanDashboardComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      config: SmartRecruiterBoardConfigResolver,
      data: SmartRecruiterBoardResolver
    },
    data: {'breadcrumb': 'Onboarding/SR kanban dashboard'}
  },
  {
    path: 'onboarding/recruiter-dashboard/create',
    component: RecruiterRequestComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      employee: EmployeeResolver,
      formData: LightFormDataResolver,
      titles: TitlesResolver,
      candidate: CandidateOfferCreateResolver,
      companies: CompaniesResolver
    },
    data: {
      'breadcrumb': 'Onboarding/Recruiter dashboard/{fullName} - Create an offer',
      'recruiterRequest': 'Create an offer',
      'isUpdateOffer': false
    }
  },
  {
    path: 'onboarding/recruiter-dashboard/update',
    component: RecruiterRequestComponent,
    canActivate: [AvoidRedirectGuard],
    canDeactivate: [CanDeactivateEditGuard],
    resolve: {
      employee: EmployeeResolver,
      formData: LightFormDataResolver,
      titles: TitlesResolver,
      candidate: CandidateOfferUpdateResolver,
      companies: CompaniesResolver
    },
    data: {
      'breadcrumb': 'Onboarding/Recruiter dashboard/{fullName} - Update an offer',
      'recruiterRequest': 'Update an offer',
      'isUpdateOffer': true
    }
  },
  {
    path: 'onboarding/recruiter-dashboard',
    component: RecruiterDashboardComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {
      formData: FormDataResolver,
      config: RecruiterDashboardConfigResolver,
      candidates: RecruiterDashboardResolver
    },
    data: {'breadcrumb': 'Onboarding/Recruiter dashboard'}
  },
  {
    path: 'error',
    component: ErrorComponent,
    canActivate: [AvoidRedirectGuard],
    resolve: {error: ErrorResolver},
    data: {'title': 'Error', 'breadcrumb': 'Error'}
  },
  {
    path: '*',
    redirectTo: 'error'
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
