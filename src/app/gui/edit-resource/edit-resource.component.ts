import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  BadgeDto,
  ChurnDto,
  CountryDto,
  ESecurityLevel,
  FormDataDto,
  FullResourceDto,
  ResourceFullNameAndAccountDto,
  SecurityClearanceDto,
  ShortResourceDto, WorkingRemoteDto
} from '../../model';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {ActivatedRoute, Router} from '@angular/router';
import {DateConvertorService} from '../../services/date-convertor.service';
import {merge, Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, exhaustMap, filter, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {NgbCalendar, NgbModal, NgbModalRef, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '../../services/loading.service';
import {ResourceService} from '../../services/Resource/resource.service';
import {NotificationService} from '../../services/notification.service';
import {FormCanDeactivateEdit} from '../../guards/can-deactivate-edit/FormCanDeactivateEdit';
import * as moment from 'moment';
import {ReferrersService} from '../../services/Referrer/referrers.service';
import {UserService} from '../../services/User/user.service';
import {dateEndFormat} from '../../validators/DateEndFormatValidator';
import {HolarisDeleteComponent} from '../modal/holaris-delete/holaris-delete.component';
import {ForceCreateComponent} from '../modal/force-create/force-create.component';
import {CheckBoxRequired} from '../../validators/CheckBoxRequired.validator';
import {CompanyService} from '../../services/Company/company.service';
import {StringUtils} from '../../utils/StringUtils';
import {FilterUtils} from '../../utils/FilterUtils';
import {ResponsibleAtArhsComponent} from '../responsible-at-arhs/responsible-at-arhs.component';
import {WorkingCertificateComponent} from '../modal/working-certificate/working-certificate.component';
import {PictureEditor} from '../../utils/PictureEditor';
import * as fileSaver from 'file-saver';
import {DailyEmailsService} from "../../services/DailyEmail/daily-emails.service";
import {WorkPermitComponent} from "../work-permit/work-permit.component";
import {ConfirmModalComponent} from '../modal/confirm-modal/confirm-modal.component';

declare const accentFold: any;


export interface SecurityClearanceRow {
  level: ESecurityLevel;
  organization: string;
  checked: boolean;
}

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.sass']
})
export class EditResourceComponent extends FormCanDeactivateEdit implements OnInit, OnDestroy {

  /** ATTRIBUTES **/

  @ViewChild('instanceReferrer') instanceReferrer: NgbTypeahead;
  @ViewChild('instanceJobPosition') instanceJobPosition: NgbTypeahead;
  @ViewChild('instanceJobTitle') instanceJobTitle: NgbTypeahead;
  @ViewChild('instanceDepartment') instanceDepartment: NgbTypeahead;
  @ViewChild('instanceCustomer') instanceCustomer: NgbTypeahead;
  @ViewChild('instanceContract') instanceContract: NgbTypeahead;
  @ViewChild('instancePartner') instancePartner: NgbTypeahead;
  @ViewChild('instanceNationality') instanceNationality: NgbTypeahead;
  @ViewChild('instanceResCountry') instanceResCountry: NgbTypeahead;
  @ViewChild('cropperComponent') cropperComponent: ImageCropperComponent;
  @ViewChild('instanceManager') instanceManager: NgbTypeahead;
  @ViewChild('responsibleAtArhsComponent') responsibleAtArhsComponent: ResponsibleAtArhsComponent;
  @ViewChild('workPermitComponent') workPermitComponent: WorkPermitComponent;
  @ViewChild('residencePermitComponent') residencePermitComponent: WorkPermitComponent;
  @ViewChild('firstTab') firstTab: ElementRef;

  @ViewChild('instanceBadgeNumber') instanceBadgeNumber: NgbTypeahead;

  clickBadgeNumber$ = new Subject<number>();
  badges: BadgeDto[] = [];
  badgesToDelete: BadgeDto[] = [];
  availableBadgeNumbers: BadgeDto[] = [];

  updateSubscription: Subscription;
  createSubscription: Subscription;

  // List of contracts.
  contractList: FullResourceDto[] = [];
  employeeList: ResourceFullNameAndAccountDto[] = [];
  displayResidencePermitInfo: boolean = false;
  workPermitIdNotRequired: boolean = false;

  readonly National = 'National';
  readonly NATO = 'NATO';
  readonly EU = 'EU';

  readonly STATIC_ORGANISATION = [this.National, this.NATO, this.EU];
  readonly WORKING_TIME_LIST = [38, 40];
  readonly EMPLOYEE_AND_OVERHEAD = ['empl', 'overh'];
  readonly REMOTE_RESOURCE_TYPE  = ['cons', 'free', 'subc', 'ptm', 'stagi'];
  readonly RESIDENTIAL_COUNTRY_TO_CHECK = "Luxembourg";
  readonly WORK_PERMIT_DOC_TYPE_TO_CHECK = "Temporary protection certificate";
  readonly RESIDENTIAL_COUNTRY_CHECK_FRONTIER = ['Belgium', 'France', 'Germany'];
  readonly SOCIAL_SECURITY_NUMBER_HIDE_COUNTRIES = ['Germany'];
  readonly SOCIAL_CONSENT_RESPONSES = [{'displayValue': '', 'value' : null}, {'displayValue': 'Yes', 'value' : true}, {'displayValue': 'No', 'value' : false}];

  previousResidentialCountry = null;

  accessTypes: string[] = [];

  /**
   * List of countries.
   */
  countries: CountryDto[];
  workingRemote: WorkingRemoteDto[];

  //  Configuration of the GUI (i.e. edit or create).
  onEdit: string;

  // Observable/Observer for referrer field click.
  clickReferrer$ = new Subject<string>();

  // Observable/Observer for job title field click.
  clickJobTitle$ = new Subject<string>();

  // Observable/Observer for department field click.
  clickDepartment$ = new Subject<string>();

  // Observable/Observer for customer field click.
  clickCustomer$ = new Subject<string>();

  // Observable/Observer for contract field click.
  clickContract$ = new Subject<string>();

  // Observable/Observer for nationality field click.
  clickNationality = new Subject<string>();

  // Observable/Observer for residential country field click.
  clickResCountry = new Subject<string>();

  // Observable/Observer for manager field click.
  clickManager$ = new Subject<string>();

  /**
   * Event sent by the cropper when an operation is made within the cropper.
   */
  imageChangedEvent: any = '';
  /**
   * Cropping window base64 image.
   */
  croppedTmp: any = '';
  /**
   * Large user picture (displayed in cropping tool).
   */
  largePicture: any;
  /**
   * Cropped user picture (displayed on 'Information' form).
   */
  croppedPicture: any = '';
  /**
   * User data.
   */
  user: FullResourceDto;
  /**
   * User data.
   */
  selectedContract: FullResourceDto;
  /**
   * Referrer list.
   */
  referrers: ShortResourceDto[] = [];
  /**
   * Form data.
   */
  formData: FormDataDto;
  /**
   * Large picture backup.
   */
  largePictureBackup: any;
  /**
   * Cropped picture backup.
   */
  croppedPictureBackup: any;
  /**
   * Is create operation successful.
   */
  isCreateSuccess = false;
  /**
   * Image file name.
   */
  imageFileName = 'default.jpg';
  /**
   * Image file name backup.
   */
  imageFileNameBackup = '';
  /**
   * Whether the image has been cropped.
   */
  hasImageBeenCropped = false;
  /**
   * If the user is administrator.
   */
  isUserAdministrator: boolean;
  hasAdminRole: boolean;

  /**
   * If the user has read role.
   */
  hasReadRole: boolean;

  hasReadAllOrAdminRole: boolean;

  today = this.calendar.getToday();

  // churn input
  churnIn: ChurnDto;

  // churn output
  churn: ChurnDto;

  organizationList: string[];

  level: SecurityClearanceRow[];

  alreadyExist = false;

  oldAccount: string;

  callSubject = new Subject<() => Promise<any>>();

  changedBadge = false;

  pictureEditor: PictureEditor;

  companyList: string[] = [];

  displayFrontierFields = false;

  displaySocialSecurityNumber = false;


  /** FORMS **/
  informationForm = new FormGroup({
    'firstName': new FormControl(null, Validators.required),
    'lastName': new FormControl(null, Validators.required),
    'account': new FormControl(null, Validators.required),
    'birthDate': new FormControl(''),
    'country': new FormControl(''),
    'resCountry': new FormControl(''),
    'comment': new FormControl(''),
    'gender': new FormControl(''),
    'partOfReferral': new FormControl(''),
    'referrer': new FormControl(''),
    'manager': new FormControl(''),
    'medicalCheck' : new FormControl(''),
    'medicalCheckEndDate' : new FormControl(''),
    'socialSecurityNumber': new FormControl(''),
    'socialConsent': new FormControl('')
  });
  contractDetailsForm = new FormGroup({
    'type': new FormControl('', Validators.required),
    'company': new FormControl('', Validators.required),
    'start': new FormControl(null, Validators.required),
    'end': new FormControl('', dateEndFormat),
    'endProbation': new FormControl(null),
    'contractTypeRadio': new FormControl(''),
    'workPercentage': new FormControl(''),
    'jobPosition': new FormControl(''),
    'jobTitle': new FormControl(''),
    'accountNecessary': new FormControl(''),
    'laptopNecessary': new FormControl(''),
    'timesheetNotMandatory': new FormControl(''),
    'contractDepartment': new FormControl(''),
    'jobPartner': new FormControl(null),
    'workingTime': new FormControl(''),
    'workerId': new FormControl('', [Validators.maxLength(100)]),
    'yearlyCePool': new FormControl('')
  });
  customerAndContractInformationForm = new FormGroup({
    'customer': new FormControl(''),
    'contract': new FormControl('')
  });
  personalUsagePolicyForm = new FormGroup({
    'showBirthDay': new FormControl(''),
    'showJobAnniversary': new FormControl(''),
    'showUserPictureOnTools': new FormControl('')
  });
  contactForm = new FormGroup({
    'landline': new FormControl(''),
    'messenger': new FormControl(''),
    'customerMail': new FormControl(''),
    'proMail': new FormControl(''),
    'mobile': new FormControl('')
  });
  emergencyContactForm = new FormGroup({
    'fullNameContact1': new FormControl(''),
    'relationshipContact1': new FormControl(''),
    'phoneNumberContact1': new FormControl(''),
    'fullNameContact2': new FormControl(''),
    'relationshipContact2': new FormControl(''),
    'phoneNumberContact2': new FormControl(''),
    'contactComment': new FormControl('')
  });

  badgeForm = new FormGroup({
    'beaconId': new FormControl('', [Validators.maxLength(255)]),
    'badgeNumber': new FormControl('', [Validators.min(0)])
  });

  securityCleranceForm: FormGroup;

  modal: NgbModalRef;

  isEligibleToRulling = false;

  accountIsAlreadyUsedByResource = false;

  sortAscending = false;


  frontierDeclarationForm = new FormGroup({
    'residentialCountry': new FormControl(null),
    'socialSecurityNumber': new FormControl(null),
    'a1Status': new FormControl('TO_DO'),
    'endOfValidityDate': new FormControl(null, dateEndFormat),
    'limosaStatus': new FormControl(null)
  });

  /** FUNCTIONS **/
  constructor(private route: ActivatedRoute, private router: Router,
              private loadingService: LoadingService, private resourceService: ResourceService,
              private calendar: NgbCalendar, private notificationService: NotificationService,
              private referrerService: ReferrersService, private userService: UserService,
              private modalService: NgbModal, public companyService: CompanyService,
              private toaster: NotificationService, private dailyMailService: DailyEmailsService,
              private changeDetector: ChangeDetectorRef) {
    super();
  }

  /**
   * Get the customer of the resource
   */
  get customer() {
    return this.customerAndContractInformationForm.get('customer');
  }

  /**
   * Get the first name of the resource
   */
  get firstName() {
    return this.informationForm.get('firstName');
  }

  /**
   * Get organization name in form
   */
  get organizationName() {
    return this.securityCleranceForm.get('organizationName');
  }

  /**
   * Get the beacon id from form.
   */
  get beaconId() {
    return this.badgeForm.get('beaconId');
  }

  /**
   * Get medical check end of validity from information form
   */
  get medicalCheckEndDate() {
    return this.informationForm.get('medicalCheckEndDate');
  }

  /**
   * Get medical checkbox value from information form
   */
  get medicalCheck() {
    return this.informationForm.get('medicalCheck');
  }

  get endOfValidityDateControl() {
    return this.frontierDeclarationForm.get('endOfValidityDate');
  }

  get a1StatusControl() {
    return this.frontierDeclarationForm.get('a1Status');
  }

  get limosaStatusControl() {
    return this.frontierDeclarationForm.get('limosaStatus');
  }

  /**
   * Handle submit action
   */
  onSubmit() {
    if (this.responsibleAtArhsComponent.responsibleForm.invalid || this.manager.invalid) {
      if (this.responsibleAtArhsComponent.inductionResponsible.invalid) {
        this.notificationService.addErrorToast('Please select a valid induction responsible.');
      }
      if (this.manager.invalid) {
        this.notificationService.addErrorToast('Please select a valid manager.');
      }
      if (this.responsibleAtArhsComponent.mentor.invalid) {
        this.notificationService.addErrorToast('Please select a valid mentor.');
      }
    } else {
      if (this.onEdit === 'edit') {
        if (!this.endDate.value || this.endDate.pristine || !this.EMPLOYEE_AND_OVERHEAD.includes(this.type.value)) {
          this.callSubject.next(() => this.updateResource(this.getDataModel()));
        } else {
          this.modal = this.modalService.open(HolarisDeleteComponent, {centered: true});
          this.modal.componentInstance.resource = this.getDataModel();
        }
      } else {
        this.callSubject.next(() => this.createResource());
      }
    }
  }

  /**
   * Initialize the forms with the resource data
   */
  initFormEdit(userToShow: FullResourceDto, emitEvent = true) {
    this.buildCompanyList();
    this.initInformationForm(userToShow, emitEvent);
    this.initContractDetailsForm(userToShow);
    this.initWorkPermitForm(userToShow);
    this.initCustomerAndContractInformation(userToShow);
    this.initPersonalUsagePolicyForm(userToShow);
    this.initContactForm(userToShow);
    this.initEmergencyContactForm(userToShow);
    this.initBadgeForm(userToShow);
    this.churnIn = userToShow.churn;
    if(userToShow.administrated) {
      this.formList().forEach(form => form.enable());
      this.responsibleAtArhsComponent.responsibleForm.enable();
      this.resourceService.checkIfAccountUsedInResources(this.user.account, this.user.id).then(isUsed => {
        this.accountIsAlreadyUsedByResource = isUsed;
      });
      if (this.user.accountUsed) {
        this.informationForm.get('account').disable();
      }
    } else {
      this.updateChurn(this.churnIn);
      this.formList().forEach(form => form.disable());
      this.responsibleAtArhsComponent.responsibleForm.disable();
    }
    this.socialConsent.setValue(userToShow.socialSecurityConsentAgreement);
    this.socialSecurityNumber.setValue(userToShow.socialSecurityNumber);
    this.a1StatusControl.setValue(userToShow.a1DeclarationStatus);
    if (userToShow.a1DeclarationExpirationDate !== null) {
      this.endOfValidityDateControl.setValue(DateConvertorService.getNgbDateStructFromString(userToShow.a1DeclarationExpirationDate));
    }
    this.limosaStatusControl.setValue(userToShow.limosaDeclarationStatus);
    this.checkFrontierWorker();
  }

  /**
   * Fill the contract list with the contracts of the resource
   */
  fillContractList() {
    this.contractList.length = 0;
    if (this.user.historyResource === undefined || this.user.historyResource.length === 0) {
      this.contractList.push(this.user);
    } else {
      // Add the user history resources
      this.user.historyResource.forEach(resource => {
        this.contractList.push(resource);
      });
      // Add current resource to the select box
      this.contractList.push(this.user);
      // Sort the box on contract starting date
      this.contractList.sort((a, b) => {
        if (moment(a.startDate, 'DD/MM/YYYY').isBefore(moment(b.startDate, 'DD/MM/YYYY'))) {
          return 1;
        } else if (moment(a.startDate, 'DD/MM/YYYY').isAfter(moment(b.startDate, 'DD/MM/YYYY'))) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  /**
   * Set the cropped picture as user picture
   */
  setCroppedAsUserPic() {
    this.croppedPicture = this.croppedTmp;
    this.croppedPictureBackup = this.croppedPicture;
    this.largePictureBackup = this.largePicture;
    this.hasImageBeenCropped = true;
  }

  /**
   * Handle file change event
   * @param event The event data
   */
  fileChangeEvent(event: any): void {
    const file: File = event.target.files[0];
    const myReader: FileReader = new FileReader();
    if (file) {
      // Wait the file to be loaded to update profile picture
      myReader.onloadend = (e) => {
        this.croppedPictureBackup = this.croppedPicture;
        this.largePictureBackup = this.largePicture;
        this.largePicture = myReader.result;
        this.imageFileNameBackup = this.imageFileName;
        this.imageFileName = file.name;
        const crop = document.getElementById('editModalButton') as HTMLElement;
        crop.click();
      };
      myReader.readAsDataURL(file);

      this.imageChangedEvent = event;
    }
  }

  /**
   * Handle image cropped event
   * @param event The event data
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedTmp = event.base64;
  }

  /**
   * Log image loaded
   */
  imageLoaded() {
    this.loadingService.hide();
  }

  /**
   * Cancel cropping of image
   */
  cancelCropping() {
    this.croppedPicture = this.croppedPictureBackup;
    this.largePicture = this.largePictureBackup;
    this.imageFileName = this.imageFileNameBackup;
  }

  /**
   * Upload resource picture
   */
  uploadPicture() {
    const fileBrowser = document.getElementById('pictureUpload') as HTMLElement;
    fileBrowser.click();
  }

  /**
   * Get the country of the resource
   */
  get country() {
    return this.informationForm.get('country');
  }

  get residentialCountry() {
    return this.informationForm.get('resCountry');
  }

  /**
   * Get the gender of the resource
   */
  get gender() {
    return this.informationForm.get('gender');
  }

  /**
   * Return the referrer if exists or empty string
   * @param userToShow - user loaded
   */
  findReferrer(userToShow) {
    if (!userToShow || !userToShow.referrerId) {
      return null;
    }
    const ref = this.referrers.find(referrer => userToShow.referrerId === referrer.id);
    return ref ? ref : null;
  }

  /**
   * Initialize the contract details form of the resource
   * @param userToShow The resource data
   */
  initContractDetailsForm(userToShow: FullResourceDto) {
    this.contractDetailsForm.reset();
    this.contractDetailsForm.get('type').setValue(userToShow.resourceType);
    this.contractDetailsForm.get('company').setValue(userToShow.company);
    if (userToShow.startDate) {
      this.contractDetailsForm.get('start').setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.startDate)
      );
    }
    if (userToShow.endProbation) {
      this.endProbation.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.endProbation)
      );
    }
    if (userToShow.endDate) {
      this.contractDetailsForm.get('end').setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.endDate)
      );
    }

    this.contractDetailsForm.get('contractTypeRadio').setValue(userToShow.workTimePercent === 100 ? 'fullTime' : 'partTime');
    if (this.contractDetailsForm.get('contractTypeRadio').value === 'fullTime') {
      this.contractDetailsForm.get('workPercentage').disable();
    }
    this.contractDetailsForm.get('workPercentage').setValue(userToShow.workTimePercent);
    this.contractDetailsForm.get('workingTime').setValue(userToShow.workingTime ? userToShow.workingTime : 38);
    this.jobPosition.setValue(this.findJobPosition(userToShow));

    this.contractDetailsForm.get('jobTitle').setValue(userToShow.title);
    this.contractDetailsForm.get('contractDepartment').setValue(userToShow.department);
    this.contractDetailsForm.get('jobPartner').setValue(userToShow.partnerId);
    this.contractDetailsForm.get('accountNecessary').setValue(userToShow.ldapNecessary);
    this.contractDetailsForm.get('laptopNecessary').setValue(userToShow.arhsLaptopNecessary);
    if (this.contractDetailsForm.get('laptopNecessary').value === true) {
      this.contractDetailsForm.get('accountNecessary').disable();
    }
    this.contractDetailsForm.get('timesheetNotMandatory').setValue(userToShow.overhead);
    this.contractDetailsForm.get('workerId').setValue(userToShow.workerId);
    this.contractDetailsForm.get('yearlyCePool').setValue(userToShow.yearlyCePool);
  }

  /**
   * Initialize the work permit information form
   * @param userToShow the candidate date that should be displayed
   */
  initWorkPermitForm(userToShow) {
    if(userToShow.workPermitIssueDate) {
      this.workPermitComponent.issueDate.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.workPermitIssueDate)
      );
    }
    if (userToShow.workPermitDate) {
      this.workPermitComponent.endOfPermitDate.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.workPermitDate)
      );
    }
    this.workPermitComponent.permitID.setValue(userToShow.workPermitId);
    this.workPermitComponent.documentType.setValue(userToShow.workPermitDocumentType);
  }

  /**
   * Initialize the residence permit information form
   * @param userToShow the candidate date that should be displayed
   */
  initResidencePermitForm(userToShow) {
    if(userToShow.residencePermitIssueDate) {
      this.residencePermitComponent.issueDate.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.residencePermitIssueDate)
      );
    }
    if (userToShow.residencePermitDate) {
      this.residencePermitComponent.endOfPermitDate.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.residencePermitDate)
      );
    }
    this.residencePermitComponent.permitID.setValue(userToShow.residencePermitId);
    this.residencePermitComponent.documentType.setValue(userToShow.residencePermitDocumentType);
  }

  /**
   * Return the job position if exists or empty string
   * @param userToShow - user loaded
   */
  findJobPosition(userToShow) {
    if (userToShow === null || userToShow.jobPosition === null) {
      return null;
    }
    const job = this.formData.jobpositions.find(pos => userToShow.jobPosition.toLowerCase() === pos.name.toLowerCase());
    return job ? job.name : userToShow.jobPosition;
  }

  /**
   * Get the contract of the resource
   */
  get contract() {
    return this.customerAndContractInformationForm.get('contract');
  }

  /**
   * Get the worker id of the resource
   */
  get workerId() {
    return this.contractDetailsForm.get('workerId');
  }

  /**
   * Get the yearly CE pool of the resource
   */
  get yearlyCePool() {
    return this.contractDetailsForm.get('yearlyCePool');
  }

  /**
   * Initialize the personal usage policy form of the resource
   * @param userToShow The resource data
   */
  initPersonalUsagePolicyForm(userToShow: FullResourceDto) {
    this.personalUsagePolicyForm.reset();
    this.personalUsagePolicyForm.get('showBirthDay').setValue(userToShow.birthSend);
    this.personalUsagePolicyForm.get('showJobAnniversary').setValue(userToShow.showJobAnniversary);
    this.personalUsagePolicyForm.get('showUserPictureOnTools').setValue(userToShow.usePicture);
  }

  /**
   * Get the proMail of the resource
   */
  get proMail() {
    return this.contactForm.get('proMail');
  }

  /**
   * Initialize emergency contact form of the resource
   * @param userToShow The resource data
   */
  initEmergencyContactForm(userToShow: FullResourceDto) {
    this.emergencyContactForm.reset();
    if (userToShow.emergencyContacts && userToShow.emergencyContacts.length > 0) {
      this.emergencyContactForm.get('fullNameContact1').setValue(userToShow.emergencyContacts[0].fullName);
      this.emergencyContactForm.get('relationshipContact1').setValue(userToShow.emergencyContacts[0].relationship);
      this.emergencyContactForm.get('phoneNumberContact1').setValue(userToShow.emergencyContacts[0].phoneNumber);
      if (userToShow.emergencyContacts.length > 1) {
        this.emergencyContactForm.get('fullNameContact2').setValue(userToShow.emergencyContacts[1].fullName);
        this.emergencyContactForm.get('relationshipContact2').setValue(userToShow.emergencyContacts[1].relationship);
        this.emergencyContactForm.get('phoneNumberContact2').setValue(userToShow.emergencyContacts[1].phoneNumber);
      }
    }
    if (userToShow.emergencyComment != null) {
      this.emergencyContactForm.get('contactComment').setValue(userToShow.emergencyComment.comment);
    }
  }

  /**
   * Init the badge form.
   * @param userToShow the user that will be displayed
   */
  initBadgeForm(userToShow: FullResourceDto) {
    this.badgeForm.reset();
    this.badgeForm.get('beaconId').setValue(userToShow.beaconId);

    if (this.hasReadRole && !this.isUserAdministrator) {
      this.badgeForm.disable();
    }
  }

  /**
   * Handle change contract type of the resource
   * @param event the event data
   */
  handleChangeContractType(event: any) {
    const target = event.target;
    if (target.value === 'fullTime') {
      this.contractDetailsForm.get('workPercentage').disable();
      this.contractDetailsForm.get('workPercentage').setValue(100);
    } else {
      this.contractDetailsForm.get('workPercentage').enable();
    }
  }

  /**
   * Handle laptop necessary change of the resource
   * @param event the event data
   */
  laptopNecessaryEvent(event: any) {
    const target = event.target;
    if (target.checked) {
      this.contractDetailsForm.get('accountNecessary').disable();
      this.contractDetailsForm.get('accountNecessary').setValue(true);
    } else {
      this.contractDetailsForm.get('accountNecessary').enable();
    }
  }

  /**
   * Handle contract change
   * @param event The event data
   */
  contractChange(event: any) {
    const contract = this.contractList[event.target.selectedIndex];
    this.selectedContract = contract;
    this.initFormEdit(contract, false);
    this.firstTab.nativeElement.click();
  }

  /**
   * Handle referrer event
   * @param event The event data
   */
  referrerEvent(event: any) {
    const target = event.target;

    if (target.checked) {
      // If referrer list is empty, fetch the list
      if (this.referrers.length === 0) {
        this.loadingService.display();
        this.referrerService.getReferrers().then((data: ShortResourceDto[]) => {
          this.referrers = data;
          this.informationForm.get('referrer').enable();
          this.loadingService.hide();
        });
      } else {
        this.informationForm.get('referrer').enable();
      }
    } else {
      this.informationForm.get('referrer').setValue(null);
      this.informationForm.get('referrer').disable();
    }
  }

  /**
   * function of Bootstrap.
   * @param x - The text to parse.
   */
  formatter = (x: { name: string }) => `${x.name}`;
  formatterString = (x: { x: string }) => `${x}`;

  /**
   * Initialize the information form of the resource
   * @param userToShow The resource data
   * @param emitEvent The emit event for residential country change.
   */
  initInformationForm(userToShow: FullResourceDto, emitEvent = true) {
    this.informationForm.reset();
    this.informationForm.get('firstName').setValue(userToShow.firstName);
    this.informationForm.get('lastName').setValue(userToShow.lastName);
    this.informationForm.get('account').setValue(userToShow.account);
    this.informationForm.get('gender').setValue(userToShow.sex);

    this.medicalCheck.setValue(userToShow.medicalCheck);
    if (userToShow.birthDate) {
      this.informationForm.get('birthDate').setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.birthDate)
      );
    }
    if (userToShow.medicalCheckEndDate) {
      this.medicalCheckEndDate.setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.medicalCheckEndDate));
    }
    this.informationForm.get('comment').setValue(userToShow.comment);
    this.informationForm.get('partOfReferral').setValue(userToShow.referrerId != null);

    if (!this.informationForm.get('partOfReferral').value) {
      this.informationForm.get('referrer').disable();
      this.informationForm.get('referrer').setValue(null);
    } else {
      // If the referrers list has not been fetched before, retrieve it from the server.
      if (this.referrers.length === 0) {
        this.loadingService.display();
        this.referrerService.getReferrers().then((data: ShortResourceDto[]) => {
          this.referrers = data;
          this.loadingService.hide();
          this.informationForm.get('referrer').setValue(this.findReferrer(userToShow));
        });
      } else {
        this.informationForm.get('referrer').setValue(this.findReferrer(userToShow));
      }
    }
    if (userToShow.nationality) {
      const elementFound = this.countries.filter(elt => userToShow.nationality
        && elt.countryCode.toLowerCase() === userToShow.nationality.toLowerCase());
      if (elementFound && elementFound.length) {
        this.country.setValue(elementFound[0]);
      } else {
        this.country.setValue({countryName: userToShow.nationality, countryCode: userToShow.nationality});
      }
    }

    if (userToShow.residentialCountry) {
      const elementFound = this.workingRemote.filter(elt => elt.countryCode.toLowerCase() === userToShow.residentialCountry.toLowerCase());
      if (elementFound && elementFound.length) {
        this.residentialCountry.setValue(elementFound[0], {emitEvent});
        this.previousResidentialCountry = this.residentialCountry.value;
      } else {
        this.residentialCountry.setValue({countryName: userToShow.residentialCountry, countryCode: userToShow.residentialCountry}, {emitEvent});
        this.previousResidentialCountry = this.residentialCountry.value;
      }
    } else {
      this.previousResidentialCountry = null;
    }

    if (userToShow.manager) {
      this.manager.setValue(this.resourceService.findEmployeeInListByAccount(this.employeeList, userToShow.manager));
    }
  }

  /**
   * Get the lastname of the resource
   */
  get lastName() {
    return this.informationForm.get('lastName');
  }

  /**
   * Get the account of the resource
   */
  get account() {
    return this.informationForm.get('account');
  }

  /**
   * Get the manager of resource
   */
  get manager() {
    return this.informationForm.get('manager');
  }

  /**
   * Get the type of resource
   */
  get type() {
    return this.contractDetailsForm.get('type');
  }

  /**
   * Get the company of resource
   */
  get company() {
    return this.contractDetailsForm.get('company');
  }


  /**
   * Set the search referrer
   * @param text$ The search referrer text
   */
  searchReferrer = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickReferrer$.pipe(filter(() => !this.instanceReferrer.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.referrers
        : this.referrers.filter(v => (`${accentFold(v.name.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Set the search for job title
   * @param text$ search job title
   */
  searchJobTitle = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickJobTitle$.pipe(filter(() => !this.instanceJobTitle.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.formData['titles']
        : this.formData['titles'].filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Set the search for department
   * @param text$ search department
   */
  searchDepartment = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickDepartment$.pipe(filter(() => !this.instanceDepartment.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.formData['departments']
        : this.formData['departments'].filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Set the search for customer
   * @param text$ search customer
   */
  searchCustomer = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickCustomer$.pipe(filter(() => !this.instanceCustomer.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.formData['customers']
        : this.formData['customers'].filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Set the search for contracts
   * @param text$ search contracts
   */
  searchContract = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickContract$.pipe(filter(() => !this.instanceContract.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.formData['customersContracts']
        : this.formData['customersContracts'].filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  formatterCountry = (x: CountryDto) => x && x.countryName ? `${x.countryName}` : x;
  formatterResidentialCountry = (x: WorkingRemoteDto) => x && x.countryLabel ? `${x.countryLabel}` : x;
  formatterEmployee = (x: { lastName: string, firstName: string, account: string}) => `${x.lastName} ${x.firstName} (${x.account})`;
  formatterBadge = (x: BadgeDto) => x && x.badgeNumber ? x.badgeNumber : x;

  /**
   * Get the birthDate of the resource
   */
  get birthDate() {
    return this.informationForm.get('birthDate');
  }

  /**
   * Get the startDate of the resource
   */
  get startDate() {
    return this.contractDetailsForm.get('start');
  }

  /**
   * Get the endDate of the resource
   */
  get endDate() {
    return this.contractDetailsForm.get('end');
  }

  /**
   * Get the endProbation of the resource
   */
  get endProbation() {
    return this.contractDetailsForm.get('endProbation');
  }

  /**
   * Get the jobPosition of the resource
   */
  get jobPosition() {
    return this.contractDetailsForm.get('jobPosition');
  }

  /**
   * Get the jobTitle of the resource
   */
  get jobTitle() {
    return this.contractDetailsForm.get('jobTitle');
  }

  /**
   * Get the department of the resource
   */
  get department() {
    return this.contractDetailsForm.get('contractDepartment');
  }

  /**
   * Get the jobPartner of the resource
   */
  get jobPartner() {
    return this.contractDetailsForm.get('jobPartner');
  }

  /**
   * The social security number.
   */
  get socialSecurityNumber() {
    return this.informationForm.get('socialSecurityNumber');
  }

  /**
   * Retrieve the social security consent.
   */
  get socialConsent() {
    return this.informationForm.get('socialConsent');
  }

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.user = this.route.snapshot.data['rsc'];
    this.formData = this.route.snapshot.data['formData'];
    this.countries = this.route.snapshot.data['countries'];
    this.workingRemote = this.route.snapshot.data['workingRemote'];
    this.employeeList = this.route.snapshot.data['employees'];
    this.onEdit = this.route.snapshot.data.type;
    if (this.user && this.onEdit === 'edit') {
      this.accessTypes = this.route.snapshot.data['accessTypes'];
      this.availableBadgeNumbers = this.route.snapshot.data['availableBadges'];
      this.badges = this.user.badgeDtoList;
    }
    const tmpSet = new Set();
    tmpSet.add(this.National);
    tmpSet.add(this.NATO);
    tmpSet.add(this.EU);
    if (this.user) {
      this.user.securityClearanceDtoList.map(elt => elt.organization).forEach(value => tmpSet.add(value));
      this.oldAccount = this.user.account;
    }

    this.buildSecurityClearanceForm();

    this.contractDetailsForm.valueChanges.subscribe(
      () => this.isEligibleToRulling = this.checkIfEligibleToRulling()
    );

    this.organizationList = Array.from(tmpSet);
    this.level = this.buildLevelTable();

    Promise.all([this.userService.isAdministrator(), this.userService.hasAdminRole()]).then(([isUserAdministrator, hasAdminRole]) => {
      this.isUserAdministrator = isUserAdministrator;
      this.hasAdminRole = hasAdminRole;
      if (!this.hasAdminRole) {
        this.formList().forEach(form => form.disable());
        this.responsibleAtArhsComponent.responsibleForm.disable();
        this.workPermitComponent.permitForm.disable();
        if (this.residencePermitComponent) {
          this.residencePermitComponent.permitForm.disable();
        }
        this.frontierDeclarationForm.disable();
      }
    });

    this.userService.hasReadRole().then((data: boolean) => {
      this.hasReadRole = data;
    });

    this.userService.isAdminRead().then((data: boolean) => {
      this.hasReadAllOrAdminRole = data;
    });

    const readerCropped: FileReader = new FileReader();
    readerCropped.onloadend = (e) => {
      this.croppedPicture = readerCropped.result;
      this.croppedPictureBackup = readerCropped.result;
    };

    readerCropped.readAsDataURL(this.route.snapshot.data['croppedPic']);

    const readerLargePictureCropped: FileReader = new FileReader();
    readerLargePictureCropped.onloadend = (e) => {
      this.largePicture = readerLargePictureCropped.result;
      this.largePictureBackup = readerLargePictureCropped.result;
    };

    readerLargePictureCropped.readAsDataURL(this.route.snapshot.data['largePic']);

    if (this.onEdit === 'edit') {
      this.displayResidencePermitInfo = this.user.residentialCountry !== "LU"
        && this.user.workPermitId !== null;
      this.workPermitIdNotRequired = this.user.workPermitDocumentType === this.WORK_PERMIT_DOC_TYPE_TO_CHECK;
      this.fillContractList();
      const currentContract = this.contractList.find(elt => elt.currentContract);
      if (currentContract) {
        this.selectedContract = currentContract;
        this.initFormEdit(currentContract);
      } else {
        this.selectedContract = this.user;
        this.initFormEdit(this.user);
      }
    } else {
      this.initFormCreate();
    }

    this.residentialCountry.valueChanges.subscribe(async (value) => {
      if (value != null && this.companyService.luxCompanies.includes(this.company.value) && (typeof(value) !== 'string' || value.length === 0)) {
        const previousCountry = this.previousResidentialCountry ? this.previousResidentialCountry.countryLabel : null;
        let result = await this.warnResidentialCountryFrontierFields(previousCountry,
          value.countryLabel);
        if (typeof (result) !== 'string') {
          if (!result) {
            this.residentialCountry.setValue(this.previousResidentialCountry, {emitEvent: false});
          } else {
            this.clearFrontierFields();
            this.previousResidentialCountry = value;
          }
        } else {
          this.previousResidentialCountry = value;
        }
        this.displayResidencePermitInfo = value && value.countryLabel !== this.RESIDENTIAL_COUNTRY_TO_CHECK
          && this.workPermitComponent.permitID.value !== null;
        this.checkFrontierWorker();
      }
    });

    this.company.valueChanges.subscribe(value => {
      this.checkFrontierWorker();
    });

    this.socialConsent.valueChanges.subscribe(value => {
      if (this.residentialCountry && this.residentialCountry.value && this.residentialCountry.value.countryCode !== 'DE') {
        this.socialSecurityNumber[value ? 'enable' : 'disable']();
        this.socialSecurityNumber.setValue(null);
      }
    });

    this.workPermitComponent.permitID.valueChanges.subscribe(value => {
      this.displayResidencePermitInfo = value && this.residentialCountry.value.countryLabel !== this.RESIDENTIAL_COUNTRY_TO_CHECK
        && this.workPermitComponent.permitID.value !== null;
    });

    this.workPermitComponent.documentType.valueChanges.subscribe(value => {
      this.workPermitIdNotRequired = this.workPermitComponent.documentType.value === this.WORK_PERMIT_DOC_TYPE_TO_CHECK;
    });

    this.updateSubscription = this.resourceService.updateSubject
      .pipe(exhaustMap(data => {
        if (data.deleteContact) {
          this.emergencyContactForm.reset();
          this.emergencyContactForm.get('contactComment').setValue('');
          data.resource.emergencyContacts =  [{
            id: null,
            resource: null,
            fullName: null,
            relationship: null,
            phoneNumber: null
          },
            {
              id: null,
              resource: null,
              fullName: null,
              relationship: null,
              phoneNumber: null
            }];
          data.resource.emergencyComment.comment = '';
        }
        if (data.deleteHoliday) {
          return this.updateResourceAndDeleteInHolaris(data.resource).catch(() => null);
        } else {
          return this.updateResource(data.resource).catch(() => null);
        }
      })).subscribe();

    this.createSubscription = this.resourceService.forceCreateSubject
      .pipe(exhaustMap(() => this.forceCreate()
        .catch(() => null)))
      .subscribe();

    this.callSubject.asObservable().pipe(
      exhaustMap(callback  => callback().catch(() => null))
    ).subscribe();

    this.account.valueChanges
      .pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged())
      .subscribe(() => {
        const account: string = this.account.value;
        if (account && account.length > 2) {
          this.resourceService.checkIfAccountUsedInResources(this.account.value, this.user ? this.user.id : null).then(isUsed => {
            this.accountIsAlreadyUsedByResource = isUsed;
          });
        } else {
          this.accountIsAlreadyUsedByResource = false;
        }
      });

    this.manager.valueChanges.subscribe(() => {
      if (this.manager.value && !this.employeeList.includes(this.manager.value)) {
        this.manager.setErrors({notInList: true});
      }
    });

    this.medicalCheck.valueChanges.subscribe(() => {
      this.handleMedicalCheckUpState();
    });
    this.handleMedicalCheckUpState();
    this.buildCompanyList();
  }

  ngAfterViewInit() {
    if (this.displayResidencePermitInfo) {
      this.initResidencePermitForm(this.user);
      this.changeDetector.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
  }

  /**
   * Build security Clearance Form
   */
  buildSecurityClearanceForm() {
    const group = {};
    group['organizationName'] = new FormControl('', Validators.required);
    this.formData.securityLevels.forEach(
      securityLevel => group[securityLevel] = new FormControl('')
    );
    this.securityCleranceForm = new FormGroup(group);
    this.securityCleranceForm.setValidators(CheckBoxRequired(this.formData.securityLevels));
  }

  /**
   * Initialize the customer and contract form of the resource
   * @param userToShow The resource data
   */
  initCustomerAndContractInformation(userToShow: FullResourceDto) {
    this.customerAndContractInformationForm.reset();
    this.customerAndContractInformationForm.get('customer').setValue(userToShow.customerName);
    this.customerAndContractInformationForm.get('contract').setValue(userToShow.customerContract);
  }

  /**
   * Get the fullNameContact1 of the resource
   */
  get fullNameContact1() {
    return this.emergencyContactForm.get('fullNameContact1');
  }

  /**
   * Get the fullNameContact2 of the resource
   */
  get fullNameContact2() {
    return this.emergencyContactForm.get('fullNameContact2');
  }

  /**
   * Get the relationshipContact1 of the resource
   */
  get relationshipContact1() {
    return this.emergencyContactForm.get('relationshipContact1');
  }

  /**
   * Get the relationshipContact2 of the resource
   */
  get relationshipContact2() {
    return this.emergencyContactForm.get('relationshipContact2');
  }

  /**
   * Get the phoneNumberContact1 of the resource
   */
  get phoneNumberContact1() {
    return this.emergencyContactForm.get('phoneNumberContact1');
  }

  /**
   * Get the phoneNumberContact2 of the resource
   */
  get phoneNumberContact2() {
    return this.emergencyContactForm.get('phoneNumberContact2');
  }

  /**
   * Get the landline of the resource
   */
  get landline() {
    return this.contactForm.get('landline');
  }

  /**
   * Get the messenger of the resource
   */
  get messenger() {
    return this.contactForm.get('messenger');
  }

  /**
   * Get the customerMail of the resource
   */
  get customerMail() {
    return this.contactForm.get('customerMail');
  }

  /**
   * Initialize contact form of the resource
   * @param userToShow The resource data
   */
  initContactForm(userToShow: FullResourceDto) {
    this.contactForm.reset();
    this.contactForm.get('landline').setValue(userToShow.landLinePhone);
    this.contactForm.get('messenger').setValue(userToShow.instantMessagingAddress);
    this.contactForm.get('customerMail').setValue(userToShow.customerEmail);
    this.contactForm.get('proMail').setValue(userToShow.professionalMail);
    this.contactForm.get('mobile').setValue(userToShow.mobilePhone);
  }

  /**
   * Get the mobile of the resource
   */
  get mobile() {
    return this.contactForm.get('mobile');
  }

  /**
   * Initialize the form in case of resource creation
   */
  initFormCreate() {
    // Check 'ARHS Laptop Necessary'
    this.contractDetailsForm.get('laptopNecessary').setValue(true);

    // Check 'ARHS Acount Necessary' and set it disabled
    this.contractDetailsForm.get('accountNecessary').setValue(true);
    this.contractDetailsForm.get('accountNecessary').disable();

    this.informationForm.get('manager').setValue(null);

    // Set default 'Full time' job for contract type radio buttons
    this.contractDetailsForm.get('contractTypeRadio').setValue('fullTime');
    this.contractDetailsForm.get('workPercentage').setValue(100);
    this.contractDetailsForm.get('workPercentage').disable();

    // Check all checkboxes in tab 'Personal usage policy'
    this.personalUsagePolicyForm.get('showBirthDay').setValue(false);
    this.personalUsagePolicyForm.get('showJobAnniversary').setValue(false);
    this.personalUsagePolicyForm.get('showUserPictureOnTools').setValue(false);

    // Disable referrer
    this.informationForm.get('referrer').disable();
    this.informationForm.get('referrer').setValue({name: ''});

    // Init select boxes in 'Contract details'
    this.contractDetailsForm.get('type').setValue(this.formData.jobtypes[0].description);
    this.contractDetailsForm.get('company').setValue(this.formData.companies[0]);

    this.contractDetailsForm.get('workingTime').setValue(38);
  }

  /**
   * Hide loading service when cropper is ready
   */
  cropperReady() {
    this.loadingService.hide();
  }

  /**
   * Load the picture in the cropper
   */
  loadPictureInCropper() {
    this.loadingService.display();
    this.cropperComponent.imageBase64 = this.largePicture;
    this.pictureEditor = new PictureEditor(this.largePicture);
  }

  /**
   * Rotate the picture in the cropper to right
   */
  rotateRight(){
    this.loadingService.display();
    this.pictureEditor.rotate(PictureEditor.ROTATE_RIGHT).then((data) => {
      this.cropperComponent.imageBase64 = data;
    })
  }

  /**
   * Rotate the picture in the cropper to left
   */
  rotateLeft(){
    this.loadingService.display();
    this.pictureEditor.rotate(PictureEditor.ROTATE_LEFT).then((data) => {
      this.cropperComponent.imageBase64 = data;
    })
  }

  /**
   * Creates a new resource from the model
   */
  createResource(): Promise<any> {
    const dto = this.getDataModel();
    return this.resourceService.createResource(dto)
      .then(() => {
        this.handleSuccessCreation(dto);
      })
      .catch(error => {
        if (error.status === 406) {
          this.modal = this.modalService.open(ForceCreateComponent, {centered: true});
          this.modal.componentInstance.message = error.error.message;
        }
      });
  }

  /**
   * Force creation of a resource
   */
  forceCreate(): Promise<any> {
    const dto = this.getDataModel();
    return this.resourceService.forceCreateResource(dto).then(() => {
      this.handleSuccessCreation(dto);
    }).finally(() => this.closeModal());
  }

  /**
   * Handle success on resource creation
   * @param dto resource created
   */
  handleSuccessCreation(dto: FullResourceDto): void {
    this.notificationService.addSuccessToast('Resource successfully created');
    this.isCreateSuccess = true;
    this.closeModal();
    this.resourceService.savePictures(this.largePicture, this.croppedPicture, this.account.value, this.imageFileName).then(() => {
      this.router.navigate(['administration/resources/', dto.account]);
    });
    this.resourceService.addToTimesheetAndHolaris(dto.account);
  }

  /**
   * Updates a resource from the model
   * @param resource to update
   */
  updateResource(resource: FullResourceDto): Promise<any> {
    return this.resourceService.updateResource(resource)
      .then((data) => {
        this.notificationService.addSuccessToast('Resource successfully saved');
        this.resourceService.savePictures(this.largePicture, this.croppedPicture, this.account.value, this.imageFileName).then(() => {
          if (this.oldAccount !== data.account) {
            this.oldAccount = data.account;
            this.router.navigate(['administration/resources/', data.account]);
          }
          this.resourceService.addToTimesheetAndHolaris(resource.account);
          this.initViewAfterUpdate(data);
        });
      }).finally(() => this.closeModal());
  }

  /**
   * Updates a resource from the model
   * @param resource to update
   */
  updateResourceAndDeleteInHolaris(resource: FullResourceDto): Promise<any> {
    return this.resourceService.updateResourceAndDeleteInHolaris(resource)
      .then((data) => {
        this.notificationService.addSuccessToast('Resource successfully saved and holidays successfully deleted in Holaris');
        this.resourceService.savePictures(this.largePicture, this.croppedPicture, this.account.value, this.imageFileName).then(() => {
          if (this.oldAccount !== data.account) {
            this.oldAccount = data.account;
            this.router.navigate(['administration/resources/', data.account]);
          }
          this.resourceService.addToTimesheet(resource.account);
          this.initViewAfterUpdate(data);
        });
      }).finally(() => this.closeModal());
  }

  /**
   * Check if the residential country field must be required,
   * i.e the selected company is part of Luxembourg entities and the selected resource type isn't
   * 'free', 'subco', 'ptm' or 'stagi'
   */
  isResidentialCountryRequired() {
    const selectedCompany: string = this.company.value;
    const selectedType: string = this.type.value;
    return selectedCompany && this.companyService.luxCompanies.includes(selectedCompany)
      && selectedType && !this.REMOTE_RESOURCE_TYPE.includes(selectedType);
  }

  /**
   * Update residential country validators
   */
  updateResidentialCountryValidity() {
    if(this.isResidentialCountryRequired()) {
      this.residentialCountry.setValidators(Validators.required);
    } else {
      this.residentialCountry.clearValidators();
    }
    this.residentialCountry.updateValueAndValidity();
  }

  /**
   * New contract click
   */
  newContractClick() {
    this.callSubject.next(() => this.newContract());
  }

  /**
   * Create a new contract
   */
  newContract(): Promise<any> {
    if (this.user) {
      // Create a new contract for the selected resource
      return this.resourceService.newContract(this.getDataModel())
        .then((data) => {
          this.resourceService.getResource(data.account).then(
            resource => {
              this.resourceService.addToTimesheetAndHolaris(this.getDataModel().account);
              this.notificationService.addSuccessToast('Contract successfully created.');
              this.initViewAfterUpdate(resource);
            }
          );
        });
    }
    return Promise.reject();
  }

  /**
   * Update the view after save action
   * @param data The save result
   */
  initViewAfterUpdate(data: FullResourceDto) {
    this.user = data;
    this.changedBadge = false;
    this.fillContractList();
    this.badges = data.badgeDtoList;
    this.badgesToDelete = [];
    if (this.selectedContract) {
      const refreshedContract = this.contractList.find(c => c.id === this.selectedContract.id);
      if (refreshedContract) {
        this.selectedContract = refreshedContract;
        this.initFormEdit(refreshedContract);
      } else {
        this.selectedContract = data;
        this.initFormEdit(data);
      }
    } else {
      this.selectedContract = data;
      this.initFormEdit(data);
    }
  }

  /**
   * Get the referrer id
   * @param referrerName The referrer name
   */
  getReferrerId(referrerName: any) {
    return (!referrerName) ? null : referrerName.id;
  }

  /**
   * Generates the account name by fetching the first and last name.
   */
  generateAccountFromNames() {

    if (this.onEdit === 'new') {
      // Get the two names instance
      let firstname: string = this.firstName.value == null ? '' : this.firstName.value.replace(/ /g, '');
      let lastname: string = this.lastName.value == null ? '' : this.lastName.value.replace(/ /g, '');

      if (lastname.length > 6) {
        lastname = lastname.substring(0, 6);
      }

      if (firstname.length > 2) {
        firstname = firstname.substring(0, 2);
      }

      const accountValue = lastname + firstname;

      this.account.setValue(accentFold(accountValue.toLowerCase()));
    }
  }

  /**
   * Check country value
   */
  checkCountryValue() {
    if (this.country.value
      && (!this.country.value.countryCode || !this.countries.some(elt => elt.countryCode === this.country.value.countryCode))) {
      this.country.setValue(null);
    }
  }

  /**
   * Check residential country value
   */
  async checkResidentialCountryValue() {
    if (this.residentialCountry.value
      && (!this.residentialCountry.value.countryCode || !this.workingRemote.some(elt => elt.countryCode === this.residentialCountry.value.countryCode))) {
      this.residentialCountry.setValue(null);
    }
  }

  /**
   * Called when the resource type is updated
   * Tick the option 'Timesheet not mandatory' if contract type OverHead is selected, otherwise uncheck
   * Tick / untick personal usages policies depending on the type value
   * @param item - item list selected
   */
  onResourceTypeChange(item) {
    if (item) {
      this.contractDetailsForm.get('timesheetNotMandatory').setValue(item === 'overh');
    }

    if (this.onEdit === 'new') {
      this.personalUsagePolicyForm.get('showBirthDay').setValue(item === 'empl' || item === 'overh');
      this.personalUsagePolicyForm.get('showJobAnniversary').setValue(item === 'empl' || item === 'overh');
      this.personalUsagePolicyForm.get('showUserPictureOnTools').setValue(item === 'empl' || item === 'overh');
    }

    this.updateResidentialCountryValidity();
  }

  /**
   * checks if we need to enable churn
   */
  get checkChurn() {
    const type = this.contractDetailsForm.get('type').value;
    const endDate = this.contractDetailsForm.get('end');
    const enableChurn = (type === 'empl' || type === 'overh')
      && endDate.value != null && endDate.value.year != null && endDate.valid;
    if (!enableChurn) {
      this.churn = this.churnIn = null;
    }
    return enableChurn;
  }

  /**
   * update churn
   * @param churn: response from child
   */
  updateChurn(churn: ChurnDto) {
    this.churn = churn;
  }

  /**
   * Search nationality.
   * @param text$ the text to look into.
   */
  searchNationality = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickNationality.pipe(filter(() => !this.instanceNationality.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.countries
        : this.countries.filter(v => (`${accentFold(v.countryName.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Search residential country.
   * @param text$ the text to look into.
   */
  searchResidentialCountry = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickResCountry.pipe(filter(() => !this.instanceResCountry.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.workingRemote
        : this.workingRemote.filter(v => (`${accentFold(v.countryLabel.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  checkOrganization(securityClearanceDto: SecurityClearanceRow) {
    securityClearanceDto.checked = !securityClearanceDto.checked;
  }

  /**
   * Close open modal
   */
  private closeModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  /**
   * Build level table
   */
  buildLevelTable(): SecurityClearanceRow[] {
    const levelArray: SecurityClearanceRow[] = [];
    this.organizationList.forEach(
      organization => {
        this.formData.securityLevels.forEach(
          level => {
            levelArray.push({
              level: level,
              organization: organization,
              checked: this.user
                && this.user.securityClearanceDtoList.some(elt => elt.organization === organization && elt.securityLevel === level),
            });
          }
        );
      }
    );
    return levelArray;
  }

  /**
   * Build security clearance dto
   */
  buildSecurityClearanceDto(): SecurityClearanceDto[] {
    const securityClearance: SecurityClearanceDto[] = [];
    this.level
      .filter(elt => elt.checked)
      .map(
        level => {
          const securityClearanceExisting = this.user ? this.user.securityClearanceDtoList
            .find(elt => elt.organization === level.organization && elt.securityLevel === level.level) : null;
          const securityClearanceDto: SecurityClearanceDto = {
            id: securityClearanceExisting ? securityClearanceExisting.id : null,
            securityLevel: level.level,
            organization: level.organization,
            checked: true,
          };
          securityClearance.push(securityClearanceDto);
        }
      );
    return securityClearance;
  }

  /**
   * Get corresponding Line
   * @param organization organization to find
   */
  getCorrespondingLine(organization: string): SecurityClearanceRow[] {
    return this.level.filter(elt => elt.organization === organization);
  }

  /**
   * Add organization in the list
   */
  addOrganization() {
    this.alreadyExist = false;
    if (!this.level.some(elt => elt.organization.toLowerCase() === this.organizationName.value.toLowerCase())) {
      this.formData.securityLevels.forEach(
        securityLevel => {

          this.level.push(
            {
              level: securityLevel,
              organization: this.organizationName.value,
              checked: this.securityCleranceForm.get(securityLevel).value === true
            }
          );
          this.securityCleranceForm.get(securityLevel).setValue('');
        }
      );
      this.organizationList.push(this.organizationName.value);
      this.organizationName.setValue('');
    } else {
      this.alreadyExist = true;
    }
  }

  /**
   * Delete organization from the list
   * @param organization organization to remove
   */
  deleteOrganization(organization) {
    this.level = this.level.filter(elt => elt.organization !== organization);
    this.organizationList = this.organizationList.filter(elt => elt !== organization);
  }

  /**
   * Notify for new parking place to the user
   */
  notifyAvailableParkingPlace(account) {
    this.dailyMailService.sendParkingNotification(account)
      .then(() => {
        this.notificationService
          .addSuccessToast(`The email has been sent successfully!`);
      })
      .finally(() => {
        document.getElementById('parkingNotification').blur();
      });
  }

  /**
   * Create the model to update/save
   */
  private getDataModel(): FullResourceDto {
    let result: FullResourceDto =  {
      account: StringUtils.trimValueIfExist(this.informationForm.get('account').value),
      active: true,
      arhsLaptopNecessary: this.contractDetailsForm.get('laptopNecessary').value,
      base64Picture: null,
      birthDate: this.informationForm.get('birthDate').value
        ? DateConvertorService.convertDateToString(this.informationForm.get('birthDate').value)
        : null,
      birthSend: this.personalUsagePolicyForm.get('showBirthDay').value,
      comment: this.informationForm.get('comment').value,
      company: this.contractDetailsForm.get('company').value,
      customerContract: StringUtils.trimValueIfExist(this.customerAndContractInformationForm.get('contract').value),
      customerEmail: StringUtils.trimValueIfExist(this.contactForm.get('customerMail').value),
      professionalMail: StringUtils.trimValueIfExist(this.contactForm.get('proMail').value),
      customerName: StringUtils.trimValueIfExist(this.customerAndContractInformationForm.get('customer').value),
      department: StringUtils.trimValueIfExist(this.contractDetailsForm.get('contractDepartment').value),
      email: null,
      emergencyComment: {
        id: (this.user && this.user.emergencyComment) ? this.user.emergencyComment.id : null,
        resource: (this.user && this.user.emergencyComment) ? this.user.emergencyComment.resource : null,
        comment: this.emergencyContactForm.get('contactComment').value
      },
      emergencyContacts: [{
        id: (this.user && this.user.emergencyContacts[0]) ? this.user.emergencyContacts[0].id : null,
        resource: (this.user && this.user.emergencyContacts[0]) ? this.user.emergencyContacts[0].resource : null,
        fullName: StringUtils.trimValueIfExist(this.emergencyContactForm.get('fullNameContact1').value),
        relationship: StringUtils.trimValueIfExist(this.emergencyContactForm.get('relationshipContact1').value),
        phoneNumber: StringUtils.trimValueIfExist(this.emergencyContactForm.get('phoneNumberContact1').value)
      },
        {
          id: (this.user && this.user.emergencyContacts[1]) ? this.user.emergencyContacts[1].id : null,
          resource: (this.user && this.user.emergencyContacts[1]) ? this.user.emergencyContacts[1].resource : null,
          fullName: StringUtils.trimValueIfExist(this.emergencyContactForm.get('fullNameContact2').value),
          relationship: StringUtils.trimValueIfExist(this.emergencyContactForm.get('relationshipContact2').value),
          phoneNumber: StringUtils.trimValueIfExist(this.emergencyContactForm.get('phoneNumberContact2').value)
        }],
      endDate: this.contractDetailsForm.get('end').value
        ? DateConvertorService.convertDateToString(this.contractDetailsForm.get('end').value)
        : null,
      firstName: StringUtils.trimValueIfExist(this.informationForm.get('firstName').value),
      historizedResource: this.contractList && this.selectedContract ? this.selectedContract.historizedResource : false,
      historyResource: [],
      id: this.selectedContract ? this.selectedContract.id : null,
      inHoliday: null,
      instantMessagingAddress: StringUtils.trimValueIfExist(this.contactForm.get('messenger').value),
      jobPosition: StringUtils.trimValueIfExist(this.jobPosition.value),
      jobTitle: StringUtils.trimValueIfExist(this.contractDetailsForm.get('jobTitle').value),
      landLinePhone: StringUtils.trimValueIfExist(this.contactForm.get('landline').value),
      lastName: StringUtils.trimValueIfExist(this.informationForm.get('lastName').value),
      ldapNecessary: this.contractDetailsForm.get('accountNecessary').value,
      mobilePhone: StringUtils.trimValueIfExist(this.contactForm.get('mobile').value),
      name: null,
      nationality: this.country.value && this.country.value.countryCode ? this.country.value.countryCode : null,
      residentialCountry: this.residentialCountry.value && this.residentialCountry.value.countryCode ?
        this.residentialCountry.value.countryCode : null,
      newContract: null,
      newResource: null,
      resourceUuid: null,
      overhead: this.contractDetailsForm.get('timesheetNotMandatory').value,
      partnerId: this.contractDetailsForm.get('jobPartner').value,
      partner: null,
      referrerId: this.getReferrerId(this.informationForm.get('referrer').value),
      resourceType: this.contractDetailsForm.get('type').value,
      sex: this.informationForm.get('gender').value,
      showJobAnniversary: this.personalUsagePolicyForm.get('showJobAnniversary').value,
      startDate: this.contractDetailsForm.get('start').value
        ? DateConvertorService.convertDateToString(this.contractDetailsForm.get('start').value)
        : null,
      endProbation: this.endProbation.value
        ? DateConvertorService.convertDateToString(this.endProbation.value)
        : null,
      title: StringUtils.trimValueIfExist(this.contractDetailsForm.get('jobTitle').value),
      usePicture: this.personalUsagePolicyForm.get('showUserPictureOnTools').value,
      workPermitDate: this.workPermitComponent.endOfPermitDate.value
        ? DateConvertorService.convertDateToString(this.workPermitComponent.endOfPermitDate.value)
        : null,
      workPermitIssueDate: this.workPermitComponent.issueDate ?
        DateConvertorService.convertDateToString(this.workPermitComponent.issueDate.value)
        : null,
      workPermitId: this.workPermitComponent.permitID.value,
      workPermitDocumentType: this.workPermitComponent.documentType.value,
      residencePermitDate: this.checkResidencePermitDateValue(this.residencePermitComponent, 'endOfPermitDate'),
      residencePermitIssueDate: this.checkResidencePermitDateValue(this.residencePermitComponent, 'issueDate'),
      residencePermitId: this.checkResidencePermitValue(this.residencePermitComponent, 'permitID'),
      residencePermitDocumentType: this.checkResidencePermitValue(this.residencePermitComponent, 'documentType'),
      workTimePercent: this.contractDetailsForm.get('workPercentage').value,
      workingTime: this.companyService.belgianCompanies.includes(this.company.value) && this.EMPLOYEE_AND_OVERHEAD.includes(this.type.value)
        ? this.contractDetailsForm.get('workingTime').value
        : null,
      color: null,
      churn: this.churn,
      securityClearanceDtoList: this.buildSecurityClearanceDto(),
      resouceHistoryIdLinked: this.onEdit === 'edit' && this.selectedContract ? this.selectedContract.resouceHistoryIdLinked : null,
      manager: this.manager.value
        ? this.manager.value.account
        : null,
      inductionResponsible: this.responsibleAtArhsComponent.getInductionResponsible(),
      mentor: this.responsibleAtArhsComponent.getMentor(),
      beaconId: this.beaconId.value,
      badgeDtoList: this.badges,
      badgesToDelete: this.badgesToDelete,
      medicalCheck: this.medicalCheck.value,
      medicalCheckEndDate: this.medicalCheckEndDate.value ? DateConvertorService.convertDateToString(this.medicalCheckEndDate.value) : null,
      resourcePhoneList: this.user ? this.user.resourcePhoneList : [],
      resourceId: this.selectedContract ? this.selectedContract.resourceId: null,
      workerId: this.workerId.value,
      yearlyCePool: this.yearlyCePool.value
    };

    if (this.displayFrontierFields) {
      result.socialSecurityConsentAgreement = this.socialConsent.value;
      result.socialSecurityNumber = this.socialSecurityNumber.value;
      result.a1DeclarationStatus = this.a1StatusControl.value;
      result.a1DeclarationExpirationDate = this.endOfValidityDateControl.value != null ?
        DateConvertorService.convertDateToString(this.endOfValidityDateControl.value) : null;
      result.limosaDeclarationStatus = this.limosaStatusControl.value;
    }

    return result;
  }

  /**
   * Check if the residence permit exist or if the residence permit date is filled
   * @param residencePermit the residencePermitComponent
   * @param datePermit the date value
   */
  checkResidencePermitDateValue(residencePermit: WorkPermitComponent, datePermit: string) {
    return residencePermit !== undefined || (residencePermit != null && residencePermit[datePermit].value)
      ? DateConvertorService.convertDateToString(residencePermit[datePermit].value)
      : null;
  }

  /**
   * Check if the residencePermit exist
   * @param residencePermit the residencePermitComponent
   * @param valueResidencePermit the value
   */
  checkResidencePermitValue(residencePermit: WorkPermitComponent, valueResidencePermit: string) {
    return residencePermit !== undefined ? residencePermit[valueResidencePermit].value : null;
  }

  /**
   * Check if resource is eligible to rulling
   */
  private checkIfEligibleToRulling() {
    return (this.type.value === 'empl' || this.type.value === 'overh')
      && this.companyService.belgianCompanies.includes(this.company.value);
  }

  /**
   * function of bootstrap for manager autocomplete.
   * @param text$ - The text of the autocomplete.
   */
  searchManager = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickManager$.pipe(filter(() => !this.instanceManager.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.employeeList
        : this.employeeList.filter(v => FilterUtils.isMatchingWithFirstNameLastNameOrAccount(v, term)))
        .slice(0, environment.nbElementsAutoComplete))
    );
  }

  get responsibleForm(): FormGroup {
    return this.responsibleAtArhsComponent.responsibleForm;
  }

  /**
   * Retrieve the badge number form control.
   */
  get badgeNumber(): AbstractControl {
    return this.badgeForm.get('badgeNumber');
  }

  /**
   * function of bootstrap for badge number autocomplete.
   * @param text$ - The text of the autocomplete.
   */
  searchBadgeNumber = (text$: Observable<number>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickBadgeNumber$.pipe(filter(() => !this.instanceBadgeNumber.isPopupOpen()));
    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (`${term}` === '' ? this.availableBadgeNumbers
        : this.availableBadgeNumbers.filter(v => `${v.badgeNumber}`.includes(`${term}`)))
        .slice(0, environment.nbElementsAutoComplete))
    );
  }

  /**
   * Add the selected badge number to the list.
   */
  addToBadgeList() {
    this.changedBadge = true;
    let badgeObject = this.badgeNumber.value;
    const badgeNumber = badgeObject.id ? badgeObject.badgeNumber : badgeObject;
    const containsBadgeNumber = this.badges.some(elt => elt.badgeNumber === badgeNumber);
    this.badgesToDelete = this.badgesToDelete.filter(elt => elt.badgeNumber !== badgeNumber);

    if (!containsBadgeNumber) {
      if (!badgeObject.badgeNumber) {
        badgeObject = {
          badgeNumber: badgeObject,
          accessTypes: []
        };
      }
      badgeObject.resource = {
          id: this.user.id,
          lastName: this.user.lastName,
          firstName: this.user.firstName,
          account: this.user.account,
          candidate: false
      };
      this.badges.push(badgeObject);
      this.badgeNumber.reset();
    }
  }

  /**
   * Toggle the badge access type.
   * @param badge the badge.
   * @param access the access.
   */
  toggleBadgeAccessType(badge: BadgeDto, access: string) {
    if (this.isResourceAdministrated) {
      const index = badge.accessTypes.indexOf(access);
      this.changedBadge = true;
      if (index >= 0) {
        badge.accessTypes.splice(index, 1);
      } else {
        badge.accessTypes.push(access);
      }
    }
  }

  /**
   * Is the access checked.
   * @param badge the badge to check.
   * @param access the access to check.
   */
  isAccessChecked(badge: BadgeDto, access: any) {
    return badge.accessTypes.some(elt => elt === access);
  }

  /**
   * Return the changed badge value.
   */
  get hasBadgeBeenChanged(): boolean {
    return this.changedBadge;
  }

  /**
   * Return the badges to delete.
   */
  get badgesToBeDeleted(): BadgeDto[] {
    return this.badgesToDelete;
  }

  /**
   * Removes the badge from the list of badges.
   * @param badge the badge to remove.
   */
  removeBadge(badge: BadgeDto) {
    if (!this.badgesToDelete.some(elt => elt.badgeNumber === badge.badgeNumber && elt.id === badge.id)) {
      this.badgesToDelete.push(badge);
    }
    this.badges = this.badges.filter(elt => elt.badgeNumber !== badge.badgeNumber || elt.id !== badge.id);
  }

  /**
   * Changes the order of the sort.
   */
  changeSort() {
    this.sortAscending = !this.sortAscending;
  }

  /**
   * Open generate certificate modal
   */
  openGenerateCertificateModal() {
    this.resourceService.getTemplateList().then(
      templateList => {
        const modalRef = this.modalService.open(
          WorkingCertificateComponent,
          {backdrop: 'static', centered: true}
        );
        modalRef.componentInstance.templateList = templateList;
        modalRef.componentInstance.account = this.selectedContract.account;
        modalRef.componentInstance.resourceId = this.selectedContract.id;
        modalRef.componentInstance.historised = !!this.selectedContract.historizedResource;
      }
    )

  }

  /**
   * Generate car policy word
   */
  generateCarPolicy() {
    this.resourceService.generateCarPolicyTemplate(this.selectedContract.id, !!this.selectedContract.historizedResource).then(
      fileData => {
        this.toaster.addSuccessToast('Successfully generated car policy');
        fileSaver.saveAs(fileData, `Car_policy_${this.selectedContract.account}.docx`);
      }
    );
  }

  /**
   * Handle medical check up date field state based on the value
   */
  handleMedicalCheckUpState() {
    if(this.medicalCheck.value) {
      this.medicalCheckEndDate.enable();
    } else {
      this.medicalCheckEndDate.disable();
    }
  }

  /**
   * Build company list from form data and admin by entity role
   */
  buildCompanyList() {
    this.companyList = [...this.formData.companies];
    if((!this.selectedContract || !this.selectedContract.administrated) && (this.selectedContract && !this.formData.companies.includes(this.selectedContract.company))) {
      this.companyList.push(this.selectedContract.company);
    }
  }

  get isResourceAdministrated() {
    return this.isUserAdministrator || (this.selectedContract && this.selectedContract.administrated || this.onEdit !== 'edit')
  }

  get hasReadAccessToResource() {
    return this.hasReadRole && (this.selectedContract && this.selectedContract.hasReadAccess)
  }

  /**
   * Checks if the frontier worker fields should be enabled.
   */
  checkFrontierWorker() {
    const countryLabel = this.residentialCountry && this.residentialCountry.value ?
      this.residentialCountry.value.countryLabel : null;
    this.displayFrontierFields = this.RESIDENTIAL_COUNTRY_CHECK_FRONTIER.includes(countryLabel) &&
      this.companyService.luxCompanies.includes(this.company.value)
      && (!this.selectedContract || this.selectedContract.administrated || this.selectedContract.hasReadAccess);
    this.displaySocialSecurityNumber = this.displayFrontierFields && !this.SOCIAL_SECURITY_NUMBER_HIDE_COUNTRIES.includes(
      countryLabel);
    if (this.displayFrontierFields && this.socialConsent.value && this.displaySocialSecurityNumber) {
      this.socialSecurityNumber.enable();
    } else {
      this.socialSecurityNumber.disable();
      this.socialSecurityNumber.setValue(null);
    }
    return this.displayFrontierFields;
  }

  /**
   * Warn the residential country for frontier fields.
   * @param previousValue the previous value.
   * @param newValue the new value.
   */
  async warnResidentialCountryFrontierFields(previousValue, newValue) {
    if (previousValue !== newValue && this.RESIDENTIAL_COUNTRY_CHECK_FRONTIER.includes(previousValue)) {
      const modal = this.modalService.open(ConfirmModalComponent, {centered: true});
      modal.componentInstance.confirmationMessage = 'Are you sure you want to change the residential country? This will remove all frontier worker data.';
      modal.componentInstance.confirmationTitle = 'Update residential country';
      return await modal.result.then(result => {
        return result;
      }).catch(error => {
        return false;
      })
    }
    return 'No check';
  }

  /**
   * Clear the frontier worker fields.
   */
  clearFrontierFields() {
    this.socialConsent.setValue(false);
    this.socialSecurityNumber.setValue(null);
    this.limosaStatusControl.setValue(null);
    this.a1StatusControl.setValue('TO_DO');
    this.endOfValidityDateControl.setValue(null);
  }

}
