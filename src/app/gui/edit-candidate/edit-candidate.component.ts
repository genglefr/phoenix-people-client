import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {
  AssetDto,
  BadgeDto,
  CandidateDto,
  ChurnDto,
  CountryDto,
  EDefaultLaptopOnSiteType,
  FormDataDto,
  HardwareDto,
  LaptopKeyboardDto,
  LightBadgeDto,
  ResourceFullNameAndAccountDto,
  ShortResourceDto, WorkingRemoteDto
} from '../../model';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {ActivatedRoute, Router} from '@angular/router';
import {DateConvertorService} from '../../services/date-convertor.service';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, exhaustMap, filter, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import {NgbCalendar, NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '../../services/loading.service';
import {NotificationService} from '../../services/notification.service';
import {CandidateService} from '../../services/Candidate/candidate.service';
import {FormCanDeactivateCandidateEdit} from '../../guards/can-deactivate-edit/FormCanDeactivateCandidateEdit';
import {ReferrersService} from '../../services/Referrer/referrers.service';
import {ResourceService} from '../../services/Resource/resource.service';
import {UserService} from '../../services/User/user.service';
import {CompanyService} from '../../services/Company/company.service';
import {StringUtils} from '../../utils/StringUtils';
import {ResponsibleAtArhsComponent} from '../responsible-at-arhs/responsible-at-arhs.component';
import {ProposalMailDto} from '../../utils/MailUtils';
import * as fileSaver from 'file-saver';
import {ConfirmationModalComponent} from "../modal/confirmation-modal/confirmation-modal.component";
import {PictureEditor} from '../../utils/PictureEditor';
import {WorkPermitComponent} from "../work-permit/work-permit.component";

declare const accentFold: any;

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.sass']
})
export class EditCandidateComponent extends FormCanDeactivateCandidateEdit implements OnInit {

  /** ATTRIBUTES **/

  @ViewChild('instanceReferrer') instanceReferrer: NgbTypeahead;
  @ViewChild('instanceJobPosition') instanceJobPosition: NgbTypeahead;
  @ViewChild('cropperComponent') cropperComponent: ImageCropperComponent;
  @ViewChild('instanceJobTitle') instanceJobTitle: NgbTypeahead;
  @ViewChild('instanceDepartment') instanceDepartment: NgbTypeahead;
  @ViewChild('instanceCustomer') instanceCustomer: NgbTypeahead;
  @ViewChild('instanceContract') instanceContract: NgbTypeahead;
  @ViewChild('instancePartner') instancePartner: NgbTypeahead;
  @ViewChild('instanceNationality') instanceNationality: NgbTypeahead;
  @ViewChild('instanceResCountry') instanceResCountry: NgbTypeahead;
  @ViewChild('responsibleAtArhsComponent') responsibleAtArhsComponent: ResponsibleAtArhsComponent;
  @ViewChild('workPermitComponent') workPermitComponent: WorkPermitComponent;
  @ViewChild('residencePermitComponent') residencePermitComponent: WorkPermitComponent;
  @ViewChild('instanceBadgeNumber') instanceBadgeNumber: NgbTypeahead;

  clickBadgeNumber$ = new Subject<number>();
  badges: BadgeDto[] = [];
  badgesToDelete: BadgeDto[] = [];
  availableBadgeNumbers: LightBadgeDto[] = [];
  changedBadge = false;
  accessTypes: string[] = [];

  /**
   * Configuration of the GUI (i.e. edit or create).
   */
  onEdit: string;
  /**
   * Observable/Observer for referrer field click.
   */
  clickReferrer$ = new Subject<string>();

  // Observable/Observer for job title field click.
  clickJobTitle$ = new Subject<string>();

  // Observable/Observer for department field click.
  clickDepartment$ = new Subject<string>();

  // Observable/Observer for customer field click.
  clickCustomer$ = new Subject<string>();

  // Observable/Observer for contract field click.
  clickContract$ = new Subject<string>();

  // Observable/Observer for partner field click.
  clickPartner$ = new Subject<string>();

  // Observable/Observer for residential country field click.
  clickResCountry = new Subject<string>();

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
  user: CandidateDto;
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
   * List of laptop model.
   */
  laptopModelList: string[];
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
  isAdminOfCandidate: boolean;
  /**
   * If the user is entityManager.
   */
  isEntityManager: boolean;
  /**
   * If the user has read role.
   */
  hasReadRole: boolean;

  private typeValidator = [];
  private companyValidator = [];
  /**
   * List of laptop model copy.
   */
  laptopModelListCopy: string[];

  /**
   * List of keyboard model copy.
   */
  laptopModelKeyboardCopy: string[];


  /**
   * List of operating system copy.
   */
  operatingSystemListCopy: string[];

  /**
   * List of countries.
   */
  countries: CountryDto[];
  workingRemote: WorkingRemoteDto[];

  today = this.calendar.getToday();

  callSubject = new Subject<() => Promise<any>>();

  pictureEditor: PictureEditor;

  /** FORMS **/

  informationForm = new FormGroup({
    'firstName': new FormControl(null, Validators.required),
    'lastName': new FormControl(null, Validators.required),
    'account': new FormControl(null, Validators.required),
    'birthDate': new FormControl(''),
    'comment': new FormControl(''),
    'gender': new FormControl(''),
    'partOfReferral': new FormControl(''),
    'referrer': new FormControl(''),
    'newGraduate': new FormControl(''),
    'status': new FormControl('NO_STATUS', Validators.required),
    'country': new FormControl(''),
    'resCountry': new FormControl(''),
    'srId': new FormControl(''),
    'socialSecurityNumber': new FormControl(''),
    'socialConsent': new FormControl('')
  });
  contractDetailsForm = new FormGroup({
    'type': new FormControl(null, Validators.required),
    'company': new FormControl(''),
    'start': new FormControl(null, Validators.required),
    'end': new FormControl(''),
    'endProbation': new FormControl(null),
    'contractTypeRadio': new FormControl(''),
    'workPercentage': new FormControl(''),
    'jobPosition': new FormControl(''),
    'jobTitle': new FormControl(''),
    'accountNecessary': new FormControl(''),
    'laptopNecessary': new FormControl(''),
    'timesheetNotMandatory': new FormControl(''),
    'contractDepartment': new FormControl(''),
    'jobPartner': new FormControl(''),
    'workingTime': new FormControl(''),
  });
  customerAndContractInformationForm = new FormGroup({
    'customer': new FormControl(''),
    'contract': new FormControl('')
  });
  contactForm = new FormGroup({
    'landline': new FormControl(''),
    'messenger': new FormControl(''),
    'customerMail': new FormControl(''),
    'proMail': new FormControl(''),
    'mobile': new FormControl('')
  });
  laptopForm = new FormGroup({
    'hardware': new FormControl('0'),
    'computerModel': new FormControl(null),
    'keyboardLayout': new FormControl(null),
    'operatingSystem': new FormControl('')
  });

  badgeForm = new FormGroup({
    'badgeNumber': new FormControl('', [Validators.min(0)])
  });

  // churn input
  churnIn: ChurnDto;

  // churn output
  churn: ChurnDto;

  // list of assets available in database
  assets: AssetDto[];

  // Observable/Observer for job position field click.
  clickNationality = new Subject<string>();

  // hardware form
  hardwareForm = new FormGroup({
    'screens': new FormControl(0),
    'comments': new FormControl(''),
    'assets': new FormControl([])
  });

  accountIsAlreadyUsedByResource = false;
  isInductionResponsibleAvailable = true;

  displayFrontierFields = false;
  displaySocialSecurityNumber = false;

  isEligibleToRulling = false;

  readonly WORKING_TIME_LIST = [38, 40];
  readonly EMPLOYEE_AND_OVERHEAD = ['empl', 'overh'];
  readonly CONTRACT_SIGNED = 'CONTRACT_SIGNED';
  readonly REMOTE_RESOURCE_TYPE  = ['cons', 'free', 'subc', 'ptm', 'stagi'];
  readonly RESIDENTIAL_COUNTRY_TO_CHECK = "Luxembourg";
  readonly WORK_PERMIT_DOC_TYPE_TO_CHECK = "Temporary protection certificate";
  readonly RESIDENTIAL_COUNTRY_CHECK_FRONTIER = ['Belgium', 'France', 'Germany'];
  readonly SOCIAL_SECURITY_NUMBER_HIDE_COUNTRIES = ['Germany'];
  readonly SOCIAL_CONSENT_RESPONSES = [{'displayValue': '', 'value' : null}, {'displayValue': 'Yes', 'value' : true}, {'displayValue': 'No', 'value' : false}];

  employeeList: ResourceFullNameAndAccountDto[] = [];

  sortAscending = false;

  candidateProposalMail: ProposalMailDto = {
    company: '',
    endDate: '',
    firstName: '',
    lastName: '',
    gender: '',
    partReferralProgram: '',
    referrer: '',
    srCandidateId: '',
    startDate: '',
    type: '',
    onSite: '',
    computerModel: '',
    keyboardLayout: '',
    operatingSystem: '',
    screens: null,
    additionalAssets: []
  };

  displayResidencePermitInfo: boolean = false;
  workPermitIdNotRequired: boolean = false;

  /** FUNCTIONS **/
  constructor(private route: ActivatedRoute, private router: Router, private calendar: NgbCalendar,
              private loadingService: LoadingService, public candidateService: CandidateService,
              private notificationService: NotificationService, private referrerService: ReferrersService,
              private resourceService: ResourceService, private userService: UserService,
              public companyService: CompanyService, private modalService: NgbModal,
              private changeDetector: ChangeDetectorRef) {
    super();
  }

  /**
   * Initialite the component
   */
  ngOnInit() {
    this.user = this.route.snapshot.data['rsc'];
    this.formData = this.route.snapshot.data['formData'];
    this.assets = this.formData.hardwareAssets;
    this.laptopModelList = this.formData['laptopModels'].map(elt => StringUtils.trimValueIfExist(elt));
    this.countries = this.route.snapshot.data['countries'];
    this.workingRemote = this.route.snapshot.data['workingRemote'];
    this.employeeList = this.route.snapshot.data['employees'];
    this.isInductionResponsibleAvailable = this.route.snapshot.data['inductionResponsible']
      ? this.route.snapshot.data['inductionResponsible']
      : true;
    this.laptopModelListCopy = this.laptopModelList.filter(() => true);
    this.laptopModelKeyboardCopy = this.formData.keyboardModels.filter(() => true);
    this.operatingSystemListCopy = this.formData.operatingSystems.filter(() => true);
    this.onEdit = this.route.snapshot.data.type;
    this.isAdminOfCandidate = this.route.snapshot.data['isAdmin'];
    if (this.user && this.onEdit === 'edit') {
      this.badges = this.user.badgeDtoList;
      this.accessTypes = this.route.snapshot.data['accessTypes'];
      this.availableBadgeNumbers = this.route.snapshot.data['availableBadges'];
    }

    if(this.user && !this.formData.companies.includes(this.user.company)) {
      this.formData.companies = [...this.formData.companies, this.user.company];
    }

    this.userService.isAdministrator().then((isUserAdministrator) => {
      this.isUserAdministrator = isUserAdministrator;
      if (!this.isAdminOfCandidate) {
        this.formList().forEach(form => form.disable());
        this.hardwareForm.disable();
        this.responsibleAtArhsComponent.responsibleForm.disable();
        this.workPermitComponent.permitForm.disable();
        if(this.residencePermitComponent) {
          this.residencePermitComponent.permitForm.disable();
        }
      }
    });

    if (this.user){
      this.userService.isEntityManagerSameEntity(this.user.id).then((data: boolean) => {
        this.isEntityManager = data;
        if (this.isEntityManager) {
          this.responsibleAtArhsComponent.responsibleForm.enable();
        }
      });
    }

    this.userService.hasReadRole().then((data: boolean) => {
      this.hasReadRole = data;
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
      if (this.route.snapshot.queryParams['isFromMail']) {
        this.mapUser();
      }
      this.initFormEdit(this.user);
    } else {
      this.initFormCreate();
      this.updateHardwareForm();
      this.updateLaptopModel(this.company.value);
      if (this.route.snapshot.queryParams['isFromMail']) {
        this.candidateProposalMail.srCandidateId = this.route.snapshot.queryParams['srCandidateId'];
        this.candidateProposalMail.firstName = this.route.snapshot.queryParams['firstName'];
        this.candidateProposalMail.lastName = this.route.snapshot.queryParams['lastName'];
        this.candidateProposalMail.gender = this.route.snapshot.queryParams['gender'];
        this.candidateProposalMail.partReferralProgram = this.route.snapshot.queryParams['partReferralProgram'];
        this.candidateProposalMail.referrer = this.route.snapshot.queryParams['referrer'];
        this.candidateProposalMail.type = this.route.snapshot.queryParams['type'];
        this.candidateProposalMail.company = this.route.snapshot.queryParams['company'];
        this.candidateProposalMail.startDate = this.route.snapshot.queryParams['startDate'];
        this.candidateProposalMail.endDate = this.route.snapshot.queryParams['endDate']
          ? this.route.snapshot.queryParams['endDate']
          : null;
        this.candidateProposalMail.jobPosition = this.route.snapshot.queryParams['jobPosition']
          ? this.route.snapshot.queryParams['jobPosition']
          : null;
        this.candidateProposalMail.jobTitle = this.route.snapshot.queryParams['jobTitle']
          ? this.route.snapshot.queryParams['jobTitle']
          : null;
        this.candidateProposalMail.newGraduate = this.route.snapshot.queryParams['newGraduate']
          ? this.route.snapshot.queryParams['newGraduate']
          : null;
        this.user = this.getDataModel();
        this.candidateProposalMail.managerAccount = this.route.snapshot.queryParams['managerAccount']
          ? this.user.manager = this.route.snapshot.queryParams['managerAccount']
          : null;
        this.candidateProposalMail.inductionResponsibleAccount = this.route.snapshot.queryParams['inductionResponsibleAccount']
          ? this.user.inductionResponsible = this.route.snapshot.queryParams['inductionResponsibleAccount']
          : null;
        this.candidateProposalMail.mentorAccount = this.route.snapshot.queryParams['mentorAccount']
          ? this.user.mentor = this.route.snapshot.queryParams['mentorAccount']
          : null;
        this.user.hardware = {
          screens: 0,
          comments: '',
          hardwareRequired: this.laptopForm.get('hardware').value === '1',
          assets: []
        };
        this.candidateProposalMail.onSite = this.route.snapshot.queryParams['onSite'];
        this.candidateProposalMail.computerModel = this.route.snapshot.queryParams['computerModel']
          ? this.user.laptopModel = this.route.snapshot.queryParams['computerModel']
          : null;
        this.candidateProposalMail.keyboardLayout = this.route.snapshot.queryParams['keyboardLayout']
          ? this.user.keyboardModel = this.route.snapshot.queryParams['keyboardLayout']
          : null;
        this.candidateProposalMail.operatingSystem = this.route.snapshot.queryParams['operatingSystem']
          ? this.user.operatingSystem = this.route.snapshot.queryParams['operatingSystem']
          : null;
        this.candidateProposalMail.operatingSystem = this.route.snapshot.queryParams['operatingSystem']
          ? this.user.operatingSystem = this.route.snapshot.queryParams['operatingSystem']
          : null;
        this.candidateProposalMail.screens = parseInt(this.route.snapshot.queryParams['screens'])
          ? this.user.hardware.screens = parseInt(this.route.snapshot.queryParams['screens'])
          : null;
        this.candidateProposalMail.additionalAssets = this.route.snapshot.queryParams['additionalAssets']
          ? this.user.hardware.assets = this.route.snapshot.queryParams['additionalAssets'].split(',')
            .map(additional => this.assets.find(asset => StringUtils.trimValueIfExist(asset.name) === StringUtils.trimValueIfExist(additional)))
            .filter(elt => !!elt)
          : [];
        this.contractDetailsForm.get('laptopNecessary').setValue(this.route.snapshot.queryParams['isLaptopNecessary'] === 'true');
        this.workPermitComponent.workPermitNecessary.setValue(this.route.snapshot.queryParams['isWorkPermitNecessary'] === 'true');
        this.initFormFromProposal();
      }
    }

    this.residentialCountry.valueChanges.subscribe(value => {
      this.displayResidencePermitInfo = value && value.countryLabel !== this.RESIDENTIAL_COUNTRY_TO_CHECK
        && this.workPermitComponent.permitID !== null;
      this.checkFrontierWorker();
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
      this.displayResidencePermitInfo = value && value.countryLabel !== this.RESIDENTIAL_COUNTRY_TO_CHECK
        && this.workPermitComponent.permitID !== null;
    });

    this.workPermitComponent.documentType.valueChanges.subscribe(value => {
      this.workPermitIdNotRequired = this.workPermitComponent.documentType.value === this.WORK_PERMIT_DOC_TYPE_TO_CHECK;
    })

    this.informationForm.get('status').valueChanges
      .subscribe(value => {
        if (value === this.CONTRACT_SIGNED) {
          this.contractDetailsForm.get('type').setValidators(this.typeValidator.concat(Validators.required));
          this.contractDetailsForm.get('type').updateValueAndValidity();
          this.contractDetailsForm.get('company').setValidators(this.companyValidator.concat(Validators.required));
          this.contractDetailsForm.get('company').updateValueAndValidity();
          this.residentialCountry.setValidators(Validators.required);
          this.residentialCountry.updateValueAndValidity();
        } else {
          this.contractDetailsForm.get('type').clearValidators();
          this.contractDetailsForm.get('company').clearValidators();
          this.residentialCountry.clearValidators();
        }
        this.checkFrontierWorker();
      });

    this.disableFields();

    this.account.valueChanges
      .pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged())
      .subscribe(() => {
        const account: string = this.account.value;
        if (account && account.length > 2) {
          this.candidateService.checkIfAccountUsedInResources(this.account.value).then(isUsed => {
            this.accountIsAlreadyUsedByResource = isUsed;
          });
        } else {
          this.accountIsAlreadyUsedByResource = false;
        }
    });

    this.callSubject.asObservable().pipe(
      exhaustMap(callback  => callback().catch(() => null))
    ).subscribe();

    this.startDate.valueChanges.subscribe(() => {
      if (this.startDate.value && this.employeeList.some(elt => elt === this.responsibleAtArhsComponent.inductionResponsible.value)) {
        this.responsibleAtArhsComponent.checkInductionResponsibleAvailability();
      }
    });
  }

  ngAfterViewInit() {
    if (this.displayResidencePermitInfo) {
      this.initResidencePermitInformation(this.user);
      this.changeDetector.detectChanges();
    }
  }

  /**
   * Initialize the forms in case of candidate creation
   */
  initFormCreate() {
    // Check "ARHS Laptop Necessary"
    this.contractDetailsForm.get('laptopNecessary').setValue(true);

    // Check "ARHS Acount Necessary" and set it disabled
    this.contractDetailsForm.get('accountNecessary').setValue(true);
    this.contractDetailsForm.get('accountNecessary').disable();

    // Set default "Full time" job for contract type radio buttons
    this.contractDetailsForm.get('contractTypeRadio').setValue('fullTime');
    this.contractDetailsForm.get('workPercentage').setValue(100);
    this.contractDetailsForm.get('workPercentage').disable();

    // Disable referrer
    this.informationForm.get('referrer').disable();
    this.informationForm.get('referrer').setValue({name: ''});

    // Init Work permit necessary to false
    this.workPermitComponent.workPermitNecessary.setValue(false);

    // Init select boxes in 'Contract details'
    this.contractDetailsForm.get('type').setValue('empl');
    this.contractDetailsForm.get('company').setValue('');

    this.laptopForm.get('hardware').setValue('0');

    this.hardwareForm.get('screens').setValue(0);
    this.hardwareForm.get('assets').setValue([]);
    this.hardwareForm.get('comments').setValue('');

    // Set operating system to default
    this.laptopForm.get('operatingSystem').setValue('DEFAULT');
    this.contractDetailsForm.get('workingTime').setValue(38);
  }

  initFormFromProposal() {
    this.informationForm.get('firstName').setValue(this.candidateProposalMail.firstName);
    this.informationForm.get('lastName').setValue(this.candidateProposalMail.lastName);
    this.informationForm.get('gender').setValue(this.candidateProposalMail.gender);
    this.informationForm.get('srId').setValue(this.candidateProposalMail.srCandidateId);
    this.contractDetailsForm.get('type').setValue(this.candidateProposalMail.type);
    this.contractDetailsForm.get('company').setValue(this.candidateProposalMail.company);
    this.laptopForm.get('hardware').setValue(this.candidateProposalMail.onSite == 'true' ? '1' : '0');
    this.laptopForm.get('computerModel').setValue(StringUtils.trimValueIfExist(this.candidateProposalMail.computerModel));
    this.laptopForm.get('keyboardLayout').setValue(StringUtils.trimValueIfExist(this.candidateProposalMail.keyboardLayout));
    this.laptopForm.get('operatingSystem').setValue(StringUtils.trimValueIfExist(this.candidateProposalMail.operatingSystem));
    this.hardwareForm.get('screens').setValue(this.candidateProposalMail.screens);
    this.hardwareForm.get('assets').setValue(this.candidateProposalMail.additionalAssets);
    this.contractDetailsForm.get('start').setValue(
      DateConvertorService.getNgbDateStructFromString(
        // @ts-ignore
        this.candidateProposalMail.startDate.replaceAll('-', '/')
      ));
    if (this.candidateProposalMail.endDate) {
      this.contractDetailsForm.get('end').setValue(
        DateConvertorService.getNgbDateStructFromString(
          // @ts-ignore
          this.candidateProposalMail.endDate.replaceAll('-', '/')
        ));
    }
    if (this.candidateProposalMail.partReferralProgram === 'true') {
      this.informationForm.get('partOfReferral').setValue(true);
      this.findReferrerByAccount(this.candidateProposalMail.referrer).then(data => this.informationForm.get('referrer').setValue(data));
    }

    if (this.candidateProposalMail.jobPosition) {
      this.jobPosition.setValue(this.candidateProposalMail.jobPosition);
    }

    if (this.candidateProposalMail.jobTitle) {
      this.contractDetailsForm.get('jobTitle').setValue(this.candidateProposalMail.jobTitle);
    }
    this.informationForm.get('newGraduate').setValue(this.candidateProposalMail.newGraduate === 'true');

    this.generateAccountFromNames();
  }

  /**
   * Initialize the forms in case of modifying a candidate
   */
  initFormEdit(userToShow: CandidateDto) {
    userToShow.arhsLaptopNecessary = userToShow.laptopModel && userToShow.laptopModel !== 'No laptop';
    this.initInformationForm(userToShow);
    this.initContractDetailsForm(userToShow);
    this.initCustomerAndContractInformation(userToShow);
    this.initWorkPermitInformation(userToShow);
    this.initContactForm(userToShow);
    this.initLaptopForm(userToShow);
    this.initHardwareForm(userToShow.hardware);
    this.churnIn = userToShow.churn;
    this.candidateService.checkIfAccountUsedInResources(this.user.account).then(isUsed => {
      this.accountIsAlreadyUsedByResource = isUsed;
    });
    this.socialConsent.setValue(userToShow.socialSecurityConsentAgreement);
    this.socialSecurityNumber.setValue(userToShow.socialSecurityNumber);
    this.checkFrontierWorker();
  }

  /**
   * Builds the hardware model of a candidate
   * @return hardware
   */
  buildHardwareModel(): HardwareDto {
    return {
      screens: this.hardwareForm.get('screens').value,
      assets: this.hardwareForm.get('assets').value,
      comments: this.hardwareForm.get('comments').value,
      hardwareRequired: this.isHardwareRequired
    };
  }

  /**
   * update churn
   * @param churn: response from child
   */
  updateChurn(churn: ChurnDto) {
    this.churn = churn;
  }

  get country() {
    return this.informationForm.get('country');
  }

  get residentialCountry() {
    return this.informationForm.get('resCountry');
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
   * Return the referrer if exists.
   * @param account of the referrer.
   */
  async findReferrerByAccount(account: string) {
    if (!this.referrers.length) {
      this.loadingService.display();
      await this.referrerService.getReferrers().then((data: ShortResourceDto[]) => {
        this.referrers = data;
        this.informationForm.get('referrer').enable();
        this.loadingService.hide();
      });
    } else {
      this.informationForm.get('referrer').enable();
    }
    return this.referrers.find(referrer => account === referrer.account);
  }

  /**
   * Initialize the contract details form
   * @param userToShow The data that should be displayed
   */
  initContractDetailsForm(userToShow: CandidateDto) {
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
    this.jobPosition.setValue(userToShow.jobPosition);
    this.contractDetailsForm.get('jobTitle').setValue(userToShow.title);
    this.contractDetailsForm.get('contractDepartment').setValue(userToShow.department);
    this.contractDetailsForm.get('jobPartner').setValue(userToShow.partner);
    this.contractDetailsForm.get('accountNecessary').setValue(userToShow.ldapNecessary);
    this.contractDetailsForm.get('laptopNecessary').setValue(userToShow.arhsLaptopNecessary);
    if (this.contractDetailsForm.get('laptopNecessary').value === true) {
      this.contractDetailsForm.get('accountNecessary').disable();
    }
    this.contractDetailsForm.get('timesheetNotMandatory').setValue(userToShow.overhead);
    this.contractDetailsForm.get('workingTime').setValue(userToShow.workingTime ? userToShow.workingTime : 38);
  }

  /**
   * Initialize the customer and contract information form
   * @param userToShow The data that should be displayed
   */
  initCustomerAndContractInformation(userToShow: CandidateDto) {
    this.customerAndContractInformationForm.reset();
    this.customerAndContractInformationForm.get('customer').setValue(userToShow.customerName);
    this.customerAndContractInformationForm.get('contract').setValue(userToShow.customerContract);
  }

  /**
   * Initialize the work permit information form
   * @param userToShow the candidate date that should be displayed
   */
  initWorkPermitInformation(userToShow: CandidateDto)  {
    this.workPermitComponent.workPermitNecessary.setValue(userToShow.workPermitNecessary);
    if(userToShow.workPermitIssueDate) {
      this.workPermitComponent.issueDate.setValue(DateConvertorService.getNgbDateStructFromString(userToShow.workPermitIssueDate));
    }
    if (userToShow.workPermitDate) {
      this.workPermitComponent.endOfPermitDate.setValue(DateConvertorService.getNgbDateStructFromString(userToShow.workPermitDate));
    }
    this.workPermitComponent.permitID.setValue(userToShow.workPermitId);
    this.workPermitComponent.documentType.setValue(userToShow.workPermitDocumentType);
  }

  /**
   * Initialize the residence permit information form
   * @param userToShow the candidate date that should be displayed
   */
  initResidencePermitInformation(userToShow: CandidateDto)  {
    if(userToShow.residencePermitIssueDate) {
      this.residencePermitComponent.issueDate.setValue(DateConvertorService.getNgbDateStructFromString(userToShow.residencePermitIssueDate));
    }
    if (userToShow.residencePermitDate) {
      this.residencePermitComponent.endOfPermitDate.setValue(DateConvertorService.getNgbDateStructFromString(userToShow.residencePermitDate));
    }
    this.residencePermitComponent.permitID.setValue(userToShow.residencePermitId);
    this.residencePermitComponent.documentType.setValue(userToShow.residencePermitDocumentType);
  }

  /**
   * Get the pro mail of the candidate
   */
  get proMail() {
    return this.contactForm.get('proMail');
  }

  /**
   * Initialize the hardware form
   * @param userToShow The data that should be displayed
   */
  initLaptopForm(userToShow: CandidateDto) {
    this.laptopForm.reset();
    this.laptopForm.get('hardware').setValue(!userToShow.hardware
      ? '0'
      : userToShow.hardware.hardwareRequired ? '1' : '0'
    );
    if (userToShow.laptopModel && userToShow.laptopModel === 'No laptop') {
      this.updateLaptopModel(userToShow.company, true);
    } else {
      this.laptopForm.get('computerModel').setValue(!userToShow.laptopModel ? null : userToShow.laptopModel);
    }
    this.laptopForm.get('keyboardLayout').setValue(!userToShow.keyboardModel ? null : userToShow.keyboardModel);
    this.laptopForm.get('operatingSystem').setValue(userToShow.operatingSystem);
  }

  /**
   * Handle submit action
   */
  onSubmit() {
    if (this.responsibleAtArhsComponent.responsibleForm.invalid) {
      if (this.responsibleAtArhsComponent.inductionResponsible.invalid) {
        this.notificationService.addErrorToast('Please select a valid induction responsible.');
      }
      if (this.responsibleAtArhsComponent.manager.invalid) {
        this.notificationService.addErrorToast('Please select a valid manager.');
      }
      if (this.responsibleAtArhsComponent.mentor.invalid) {
        this.notificationService.addErrorToast('Please select a valid mentor.');
      }
    } else {
      if (this.onEdit === 'edit') {
        this.callSubject.next(() => this.updateCandidate());
      } else {
        this.callSubject.next(() => this.createCandidate());
      }
    }
  }

  /**
   * Set cropped picture as user picture
   */
  setCroppedAsUserPic() {
    this.croppedPicture = this.croppedTmp;
    this.croppedPictureBackup = this.croppedPicture;
    this.largePictureBackup = this.largePicture;
    this.hasImageBeenCropped = true;
  }

  /**
   * Handle the file changed event of the picture
   * @param event the event data
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
        const crop = document.getElementById('cropModalButton') as HTMLElement;
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
    // console.log('The image has been successfully loaded in the cropper');
  }

  /**
   * Cancel the cropping of the picture
   */
  cancelCropping() {
    this.croppedPicture = this.croppedPictureBackup;
    this.largePicture = this.largePictureBackup;
    this.imageFileName = this.imageFileNameBackup;
  }

  /**
   * Updload a picture
   */
  uploadPicture() {
    const fileBrowser = document.getElementById('pictureUpload') as HTMLElement;
    fileBrowser.click();
  }

  /**
   * Handle the change of the contract type
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
   * Handle the change of laptop necessary option
   * @param event the event data
   */
  laptopNecessaryEvent(event: any) {
    const target = event.target;
    if (!target.checked) {
      this.contractDetailsForm.get('accountNecessary').enable();
    }
  }

  /**
   * Handle the referrer event
   * @param event the event data
   */
  referrerEvent(event: any) {
    const target = event.target;

    if (target.checked) {
      // If referrer list is empty, fetch the list
      if (!this.referrers.length) {
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
  formatterEmployee = (x: { lastName: string, firstName: string, account: string}) => `${x.lastName} ${x.firstName} (${x.account})`;
  formatterBadge = (x: BadgeDto) => x && x.badgeNumber ? x.badgeNumber : x;

  /**
   * Initialize the information form
   * @param userToShow The data that should be displayed
   */
  initInformationForm(userToShow: CandidateDto) {
    this.informationForm.reset();
    this.informationForm.get('firstName').setValue(userToShow.firstName);
    this.informationForm.get('lastName').setValue(userToShow.lastName);
    this.informationForm.get('account').setValue(userToShow.account);
    this.informationForm.get('gender').setValue(userToShow.sex);

    if (userToShow.birthDate) {
      this.informationForm.get('birthDate').setValue(
        DateConvertorService.getNgbDateStructFromString(userToShow.birthDate)
      );
    }
    this.informationForm.get('comment').setValue(userToShow.comment);
    this.informationForm.get('partOfReferral').setValue(userToShow.referrerId != null);
    this.informationForm.get('status').setValue(userToShow.status);
    if(this.informationForm.get('status').value === this.CONTRACT_SIGNED) {
      this.residentialCountry.setValidators(Validators.required);
      this.residentialCountry.updateValueAndValidity();
    }
    this.informationForm.get('newGraduate').setValue(userToShow.newGraduate);
    this.informationForm.get('srId').setValue(userToShow.srCandidateId);

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
        this.residentialCountry.setValue(elementFound[0]);
      } else {
        this.residentialCountry.setValue({countryName: userToShow.residentialCountry, countryCode: userToShow.residentialCountry});
      }
    }
  }

  /**
   * Determine the search referrer
   * @param text$ The search text
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

  formatterCountry = (x: CountryDto) => x && x.countryName ? `${x.countryName}` : '';

  formatterResidentialCountry = (x: WorkingRemoteDto) => x && x.countryLabel ? `${x.countryLabel}` : '';

  /**
   * Get the status of the candidate
   */
  get status() {
    return this.informationForm.get('status');
  }

  /**
   * Get the firstname of the candidate
   */
  get firstName() {
    return this.informationForm.get('firstName');
  }

  /**
   * Get the lastname of the candidate
   */
  get lastName() {
    return this.informationForm.get('lastName');
  }

  /**
   * Get the account of the candidate
   */
  get account() {
    return this.informationForm.get('account');
  }

  /**
   * Get the birthdate of the candidate
   */
  get birthDate() {
    return this.informationForm.get('birthDate');
  }

  /**
   * Get the start date of the candidate
   */
  get startDate() {
    return this.contractDetailsForm.get('start');
  }

  /**
   * Get the end date of the candidate
   */
  get endDate() {
    return this.contractDetailsForm.get('end');
  }

  /**
   * Get the end probation of the candidate
   */
  get endProbation() {
    return this.contractDetailsForm.get('endProbation');
  }

  /**
   * Get the type of the contract
   */
  get type() {
    return this.contractDetailsForm.get('type');
  }

  /**
   * Get the company of the candidate
   */
  get company() {
    return this.contractDetailsForm.get('company');
  }

  /**
   * Get the job position of the candidate
   */
  get jobPosition() {
    return this.contractDetailsForm.get('jobPosition');
  }

  /**
   * Get the job title of the candidate
   */
  get jobTitle() {
    return this.contractDetailsForm.get('jobTitle');
  }

  /**
   * Get the department of the candidate
   */
  get department() {
    return this.contractDetailsForm.get('contractDepartment');
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

  /**
   * Check residential country value
   */
  checkResidentialCountryValue() {
    if (this.residentialCountry.value
      && (!this.residentialCountry.value.countryCode || !this.workingRemote.some(elt => elt.countryCode === this.residentialCountry.value.countryCode))) {
      this.residentialCountry.setValue(null);
    }
  }

  /**
   * Get the job partner of the candidate
   */
  get jobPartner() {
    return this.contractDetailsForm.get('jobPartner');
  }

  /**
   * Get the customer of the candidate
   */
  get customer() {
    return this.customerAndContractInformationForm.get('customer');
  }

  /**
   * Get the contract of the candidate
   */
  get contract() {
    return this.customerAndContractInformationForm.get('contract');
  }

  /**
   * Get the landline of the candidate
   */
  get landline() {
    return this.contactForm.get('landline');
  }

  /**
   * Get the messenger of the candidate
   */
  get messenger() {
    return this.contactForm.get('messenger');
  }

  /**
   * Get the customer mail of the candidate
   */
  get customerMail() {
    return this.contactForm.get('customerMail');
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
   * Initialize the contact form
   * @param userToShow The data that should be displayed
   */
  initContactForm(userToShow: CandidateDto) {
    this.contactForm.reset();
    this.contactForm.get('landline').setValue(userToShow.landLinePhone);
    this.contactForm.get('messenger').setValue(userToShow.instantMessagingAddress);
    this.contactForm.get('customerMail').setValue(userToShow.customerEmail);
    this.contactForm.get('proMail').setValue(userToShow.professionalMail);
    this.contactForm.get('mobile').setValue(userToShow.mobilePhone);
  }

  /**
   * Get the mobile phone of the candidate
   */
  get mobile() {
    return this.contactForm.get('mobile');
  }

  /**
   * Return form disabled if laptop not on site
   */
  get isHardwareRequired(): boolean {
    return this.laptopForm.get('hardware').value === '1';
  }

  /**
   * Hide the loading service when cropper is ready
   */
  cropperReady() {
    // console.log('Cropper is ready');
    this.loadingService.hide();
  }

  /**
   * Load the picture into the cropper
   */
  loadPictureInCropper() {
    this.loadingService.display();
    this.cropperComponent.imageBase64 = this.largePicture;
    this.pictureEditor = new PictureEditor(this.largePicture);
  }

  /**
   * Creates a new candidate from the model
   */
  createCandidate(): Promise<any> {
    const dto = this.getDataModel();
    return this.candidateService.checkIfAccountUsedInResourcesOrCandidates(dto.account)
      .then((exist) => {
          if (exist) {
            this.notificationService.addWarningToast('Account already assigned to a resource or a candidate.');
          }
        }
      ).finally(() => {
      return this.candidateService.createCandidate(dto)
        .then(() => {
          this.notificationService.addSuccessToast('Candidate successfully created.');
          this.isCreateSuccess = true;
          this.router.navigate(['administration/candidates/', dto.account]);
          /*this.resourceService.savePictures(this.largePicture, this.croppedPicture, this.account.value, this.imageFileName).then(() => {
            this.router.navigate(['administration/candidates/', dto.account]);
          });*/
        });
    });
  }

  /**
   * Updates a candidate from the model
   */
  updateCandidate(): Promise<any> {
    return this.candidateService.updateCandidate(this.getDataModel())
      .then((data) => {
        this.notificationService.addSuccessToast('Candidate successfully saved');
        this.user = data;
        this.badges = this.user.badgeDtoList;
        if (this.isAdminOfCandidate) {
          this.resourceService.savePictures(this.largePicture, this.croppedPicture, this.account.value, this.imageFileName);
        }
        this.changedBadge = false;
        this.badgesToDelete = [];
        this.resetForms();
      });
  }

  /**
   * Get the referrer id
   */
  getReferrerId(referrerName: any) {
    return (!referrerName) ? null : referrerName.id;
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
   * Check the option 'Timesheet not mandatory' if contract type OverHead is selected, otherwise uncheck
   * @param item - item list selected
   */
  checkTimesheet(item) {
    if (item) {
      this.contractDetailsForm.get('timesheetNotMandatory').setValue(item === 'overh');
    }
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

  /**
   * Set the search for partner
   * @param text$ search partner
   */
  searchPartner = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(environment.searchInputDelay), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickPartner$.pipe(filter(() => !this.instancePartner.isPopupOpen()));

    return merge(debouncedText$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.formData['partners']
        : this.formData['partners'].filter(v => (`${accentFold(v.toLowerCase())}`)
          .includes(accentFold(term.toLowerCase())))).slice(0, 10))
    );
  }

  /**
   * Updates the list of laptops and preselect the default one and the keyboard
   * @param company - candidate's company
   * @param force - force update
   */
  updateLaptopModel(company: string, force: boolean = false) {
    if (company) {
      if ((this.contractDetailsForm.get('laptopNecessary').value || force) && !this.companyService.luxCompanies.includes(company)) {
        this.candidateService.getLaptopModelsByCompany(company)
          .then(data => {
            this.laptopModelList = data.map(x => x.laptopName);
            const onSite: EDefaultLaptopOnSiteType = this.laptopForm.get('hardware').value === '1' ? 'ON_SITE' : 'OFF_SITE';
              const defaultSettings: LaptopKeyboardDto = data.find(
                ent => ent.linkType === 'DEFAULT'
                  && (ent.onSiteType === 'BOTH' || ent.onSiteType === onSite)
              );
              if (defaultSettings) {
                this.laptopForm.get('computerModel').setValue(defaultSettings.laptopName);
                this.laptopForm.get('keyboardLayout').setValue(defaultSettings.keyboardName);
              } else {
                this.clearFields();
              }
          });
      }
    }
  }

  /**
   * Set clear fields
   */
  clearFields() {
    this.laptopForm.get('computerModel').setValue(null);
    this.laptopForm.get('keyboardLayout').setValue(null);
    this.laptopForm.get('operatingSystem').setValue('DEFAULT');
  }

  /**
   * Save the candidate and move it into the resources.
   */
  moveCandidate() {
    if(this.candidateService.canBeMoved(this.status.value, this.company.value, this.startDate.value,
      this.isHardwareRequired, this.laptopForm.get('computerModel').value, this.laptopForm.get('keyboardLayout').value)) {
      this.updateCandidate()
        .then(() => {
          const confirmationModal = this.modalService.open(ConfirmationModalComponent, {centered: true});
          confirmationModal.componentInstance.account = this.user.account;
          confirmationModal.componentInstance.action = 'move';
          confirmationModal.componentInstance.isEdit = true;
        });
    }
  }

  /**
   * Create the model to update/save
   */
  private getDataModel(): CandidateDto {
    const candidate: CandidateDto = {
      status: this.informationForm.get('status').value,
      laptopModel: this.laptopForm.get('computerModel').value,
      keyboardModel: this.laptopForm.get('keyboardLayout').value,
      operatingSystem: this.laptopForm.get('operatingSystem').value,
      projectAssignment: '',
      newGraduate: this.informationForm.get('newGraduate').value,
      account: StringUtils.trimValueIfExist(this.informationForm.get('account').value),
      active: true,
      arhsLaptopNecessary: this.contractDetailsForm.get('laptopNecessary').value,
      base64Picture: null,
      birthDate: this.informationForm.get('birthDate').value
        ? DateConvertorService.convertDateToString(this.informationForm.get('birthDate').value)
        : null,
      birthSend: false,
      comment: this.informationForm.get('comment').value,
      company: this.contractDetailsForm.get('company').value,
      customerContract: StringUtils.trimValueIfExist(this.customerAndContractInformationForm.get('contract').value),
      customerEmail: StringUtils.trimValueIfExist(this.contactForm.get('customerMail').value),
      professionalMail: StringUtils.trimValueIfExist(this.contactForm.get('proMail').value),
      customerName: StringUtils.trimValueIfExist(this.customerAndContractInformationForm.get('customer').value),
      department: StringUtils.trimValueIfExist(this.contractDetailsForm.get('contractDepartment').value),
      email: null,
      emergencyComment: null,
      emergencyContacts: null,
      endDate: this.contractDetailsForm.get('end').value
        ? DateConvertorService.convertDateToString(this.contractDetailsForm.get('end').value)
        : null,
      endProbation: this.endProbation.value
        ? DateConvertorService.convertDateToString(this.endProbation.value)
        : null,
      firstName: StringUtils.trimValueIfExist(this.informationForm.get('firstName').value),
      historizedResource: null,
      historyResource: [],
      id: this.user ? this.user.id : null,
      inHoliday: null,
      resourceUuid: null,
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
      overhead: this.contractDetailsForm.get('timesheetNotMandatory').value,
      partner: StringUtils.trimValueIfExist(this.contractDetailsForm.get('jobPartner').value),
      referrerId: this.getReferrerId(this.informationForm.get('referrer').value),
      resourceType: this.contractDetailsForm.get('type').value,
      sex: this.informationForm.get('gender').value,
      showJobAnniversary: false,
      startDate: this.contractDetailsForm.get('start').value
        ? DateConvertorService.convertDateToString(this.contractDetailsForm.get('start').value)
        : null,
      title: StringUtils.trimValueIfExist(this.contractDetailsForm.get('jobTitle').value),
      usePicture: false,
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
      color: null,
      hardware: this.contractDetailsForm.get('laptopNecessary').value ? this.buildHardwareModel() : null,
      churn: this.churn,
      workingTime: this.companyService.belgianCompanies.includes(this.company.value) && this.EMPLOYEE_AND_OVERHEAD.includes(this.type.value)
        ? this.contractDetailsForm.get('workingTime').value
        : null,
      manager: this.responsibleAtArhsComponent.getManager(),
      inductionResponsible: this.responsibleAtArhsComponent.getInductionResponsible(),
      mentor: this.responsibleAtArhsComponent.getMentor(),
      srCandidateId: this.informationForm.get('srId').value
        ? this.informationForm.get('srId').value
        : null,
      badgeDtoList: this.badges,
      badgesToDelete: this.badgesToDelete,
      resourcePhoneList:  this.user ? this.user.resourcePhoneList : [],
      workPermitNecessary: this.workPermitComponent.workPermitNecessary.value,
    };

    if(this.displayFrontierFields) {
      candidate.socialSecurityConsentAgreement = this.socialConsent.value;
      candidate.socialSecurityNumber = this.socialSecurityNumber.value;
    }

    return candidate;
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
   * Checks if the frontier worker fields should be enabled.
   */
  checkFrontierWorker() {
    const countryLabel = this.residentialCountry && this.residentialCountry.value
      ? this.residentialCountry.value.countryLabel
      : null;
    this.displayFrontierFields = this.RESIDENTIAL_COUNTRY_CHECK_FRONTIER.includes(countryLabel)
      && this.companyService.luxCompanies.includes(this.company.value)
      && (this.isUserAdministrator || this.isAdminOfCandidate || this.hasReadRole);
    this.displaySocialSecurityNumber = this.displayFrontierFields
      && !this.SOCIAL_SECURITY_NUMBER_HIDE_COUNTRIES.includes(countryLabel);

    if (this.displayFrontierFields && this.socialConsent.value && this.displaySocialSecurityNumber) {
      this.socialSecurityNumber.enable();
    } else {
      this.socialSecurityNumber.disable();
      this.socialSecurityNumber.setValue(null);
    }
  }

  /**
   * This method sets the form with default values
   * */
  setDefaultForm() {
    this.hardwareForm.get('screens').setValue(2);
    this.hardwareForm.get('comments').setValue('');
    this.hardwareForm.get('assets').setValue([...this.assets]);
  }

  /**
   * This method sets the form values
   * */
  private initHardwareForm(hardware: HardwareDto) {
    if (hardware) {
      this.hardwareForm.get('screens').setValue(hardware.screens);
      if (hardware.assets != null) {
        this.hardwareForm.get('assets').setValue(Array.from(hardware.assets));
      }
      this.hardwareForm.get('comments').setValue(hardware.comments);
    } else {
      this.hardwareForm.get('screens').setValue(0);
      this.hardwareForm.get('comments').setValue('');
      this.hardwareForm.get('assets').setValue([]);
    }
  }

  /**
   * This method updates the form object and disables the form
   * */
  updateHardwareForm() {
    if (this.laptopForm.get('hardware').value === '1') {
      this.setDefaultForm();
    } else {
      this.initHardwareForm({
        screens: 0,
        comments: '',
        hardwareRequired: false,
        assets: []
      });
    }
    this.disableFields();
  }

  /**
   * This method checks and disables the form
   * */
  private disableFields() {
    const disabled = !this.isHardwareRequired;
    disabled ? this.hardwareForm.get('screens').disable() : this.hardwareForm.get('screens').enable();
    disabled ? this.hardwareForm.get('comments').disable() : this.hardwareForm.get('comments').enable();
  }

  /**
   * Mark all forms as pristine
   */
  private resetForms() {
    this.formList().forEach(form => form.markAsPristine());
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
        candidate: true
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
    if (this.isAdminOfCandidate) {
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
   * Return the badges to be deleted.
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
   * Generate car policy word
   */
  generateCarPolicy() {
    this.candidateService.generateCarPolicyTemplate(this.user.id).then(
      fileData => {
        this.notificationService.addSuccessToast('Successfully generated car policy');
        fileSaver.saveAs(fileData, `Car_policy_${this.informationForm.get('account').value}.docx`);
      }
    );
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
   * Map the user based on query params.
   */
  mapUser() {
    const query = this.route.snapshot.queryParams;

    this.user = this.getDataModel();
    this.user.firstName = query['firstName'];
    this.user.lastName = query['lastName'];
    this.user.sex = query['gender'];
    this.user.referrerId = query['referrer'];
    this.user.resourceType = query['type'];
    this.user.company = query['company'];
    this.user.startDate = query['startDate'];
    this.user.endDate = query['endDate'] || null;
    this.user.jobPosition = query['jobPosition'] || null;
    this.user.jobTitle = query['jobTitle'] || null;
    this.user.newGraduate = query['newGraduate'] || null;

    this.user.manager = query['managerAccount'] || null;
    this.user.inductionResponsible = query['inductionResponsibleAccount'] || null;
    this.user.mentor = query['mentorAccount'] || null;

    this.user.laptopModel = query['computerModel'] || null;
    this.user.keyboardModel = query['keyboardLayout'] || null;
    this.user.operatingSystem = query['operatingSystem'] || null;

    this.user.hardware = {
      screens: parseInt(query['screens']) || 0,
      comments: '',
      hardwareRequired: this.laptopForm.get('hardware').value === '1',
      assets: query['additionalAssets']
        ? query['additionalAssets'].split(',')
          .map(additional =>
            this.assets.find(asset =>
              StringUtils.trimValueIfExist(asset.name) === StringUtils.trimValueIfExist(additional)
            )
          )
          .filter(elt => !!elt)
        : []
    };

    this.contractDetailsForm.get('laptopNecessary').setValue(query['isLaptopNecessary'] === 'true');
    this.workPermitComponent.workPermitNecessary.setValue(query['isWorkPermitNecessary'] === 'true');
    this.informationForm.get('partOfReferral').setValue(query['partReferralProgram'] === 'true');
  }

}
