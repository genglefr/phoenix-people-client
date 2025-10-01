import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AssetDto,
  CandidateDto,
  CandidateEmployeeProposalDto,
  CandidateFreelanceProposalDto,
  CandidateProposalDto,
  CandidateRequestAuthorDto, CountryDto,
  EDefaultLaptopOnSiteType,
  FormDataDto,
  HardwareDto,
  LaptopKeyboardDto,
  RecruiterBoardResourceDto,
  RecruiterMailDefaultRequestDto,
  RecruiterMailEmployeeRequestDto,
  RecruiterMailFreelanceRequestDto,
  RecruiterMailRequestDto,
  ResourceFullNameAndAccountDto,
  ShortResourceDto, WorkingRemoteDto
} from '../../../model';
import {ActivatedRoute, Router} from '@angular/router';
import {OnBoardingService} from '../../../services/OnBoarding/on-boarding.service';
import {LoadingService} from '../../../services/loading.service';
import {ReferrersService} from '../../../services/Referrer/referrers.service';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment.prod';
import {NgbCalendar, NgbModal, NgbModalOptions, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponsibleAtArhsComponent} from '../../responsible-at-arhs/responsible-at-arhs.component';
import {EmployeeOfferFormComponent} from './employee-offer-form/employee-offer-form.component';
import {CandidateService} from '../../../services/Candidate/candidate.service';
import {DateConvertorService} from '../../../services/date-convertor.service';
import {FreelancerOfferFormComponent} from './freelancer-offer-form/freelancer-offer-form.component';
import {SendMailComponent} from '../../modal/send-mail/send-mail.component';
import {MailUtils} from '../../../utils/MailUtils';
import {MailService} from '../../../services/Mail/mail.service';
import {NotificationService} from '../../../services/notification.service';
import {FormCanDeactivateRecruiterOffer} from '../../../guards/can-deactivate-edit/FormCanDeactivateRecruiterOffer';
import {keyBoardIfLaptopValidator} from "../../../validators/KeyBoardIfLaptop.validator";
import {CompanyService} from "../../../services/Company/company.service";

declare const accentFold: any;

@Component({
  selector: 'app-recruiter-request',
  templateUrl: './recruiter-request.component.html',
  styleUrls: ['./recruiter-request.component.sass']
})
export class RecruiterRequestComponent extends FormCanDeactivateRecruiterOffer implements OnInit {

  readonly employee = 'empl';
  readonly overhead = 'overh';
  readonly freelance = 'free';
  isCreateSuccess = false;
  isUpdateOffer = false;

  @ViewChild('instanceReferrer') instanceReferrer: NgbTypeahead;
  @ViewChild('responsibleAtArhsComponent') responsibleAtArhsComponent: ResponsibleAtArhsComponent;
  @ViewChild('employeeProposalComponent') employeeProposalComponent: EmployeeOfferFormComponent;
  @ViewChild('freelancerProposalComponent') freelancerProposalComponent: FreelancerOfferFormComponent;

  proposalForm = new FormGroup({
    'firstName': new FormControl(null, Validators.required),
    'lastName': new FormControl(null, Validators.required),
    'gender': new FormControl(null, Validators.required),
    'partOfReferral': new FormControl(null),
    'referrer': new FormControl(null),
    'type': new FormControl(null, Validators.required),
    'company': new FormControl(null, Validators.required),
    'isWorkPermitNecessary': new FormControl(false),
    'startDate': new FormControl(null, Validators.required),
    'endDate': new FormControl(null),
    'laptopNecessary' : new FormControl(true)
  });

  laptopForm = new FormGroup({
    'hardware': new FormControl('0'),
    'computerModel': new FormControl(null),
    'keyboardLayout': new FormControl(null),
    'operatingSystem': new FormControl('')
  }, {validators: [keyBoardIfLaptopValidator()]})

  hardwareForm = new FormGroup({
    'screens': new FormControl(0),
    'comments': new FormControl('')
  });

  requestTitle = '';
  candidate = {
    srJobId: '',
    ecompany: undefined,
    belgianEntity: false,
    firstName: '', lastName: '', usourceCompany: '',
    company: '',
    isBelgianEntity: false,
    jobTitle: '',
    lastRequest: '',
    requestAuthor: '',
    srCandidateId: '',
    subStatus: '',
    fullName: ''
  } as RecruiterBoardResourceDto;

  readonly SCREENS = [0, 1, 2, 3, 4];
  readonly DEFAULT_HARDWARE: HardwareDto = {
    screens: 2,
    comments: '',
    hardwareRequired: false,
    assets: []
  };
  readonly EMPTY_HARDWARE: HardwareDto = {
    screens: 0,
    comments: '',
    hardwareRequired: false,
    assets: []
  };
  selectedAssets: AssetDto[] = [];
  hardwareDto: HardwareDto = this.EMPTY_HARDWARE;
  assets: AssetDto[];
  laptopModelKeyboardCopy: string[];
  operatingSystemListCopy: string[];
  candidateDatabase: CandidateDto;
  laptopModelList: string[];
  laptopModelListCopy: string[];
  checkboxDisable: boolean;
  employeeList: ResourceFullNameAndAccountDto[] = [];
  isInductionResponsibleAvailable = true;
  referrers: ShortResourceDto[] = [];
  formData: FormDataDto;
  companies: string[] = [];
  titles: string[] = [];
  today = this.calendar.getToday();

  clickReferrer$ = new Subject<string>();

  constructor(private route: ActivatedRoute, private onboardingService: OnBoardingService,
              private router: Router, private loadingService: LoadingService,
              private referrerService: ReferrersService,  private calendar: NgbCalendar,
              private candidateService: CandidateService, private modalService: NgbModal,
              private mailService: MailService, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.employeeList = this.route.snapshot.data['employee'];
    this.formData = this.route.snapshot.data['formData'];
    this.titles = this.route.snapshot.data['titles'];
    this.companies = this.route.snapshot.data['companies'];
    this.assets = this.formData.hardwareAssets;
    this.laptopModelList = this.formData['laptopModels'];
    this.laptopModelListCopy = this.laptopModelList.filter(() => true);
    this.laptopModelKeyboardCopy = this.formData.keyboardModels.filter(() => true);
    this.operatingSystemListCopy = this.formData.operatingSystems.filter(() => true);
    this.candidate = this.route.snapshot.data['candidate'][0];
    this.requestTitle = this.route.snapshot.data.recruiterRequest;
    this.isUpdateOffer = this.route.snapshot.data.isUpdateOffer;

    this.initProposalForm();
    this.initHardwareLaptopForm();

    this.startDate.valueChanges.subscribe(() => {
      if (this.startDate.value && this.responsibleAtArhsComponent
        && this.employeeList.some(elt => elt === this.responsibleAtArhsComponent.inductionResponsible.value)) {
        this.responsibleAtArhsComponent.checkInductionResponsibleAvailability();
      }
    });

    if (this.requestTitle === 'Update an offer') {
      this.candidateDatabase = this.route.snapshot.data['candidate'][1];
      if (this.candidateDatabase) {
        this.initFormWithDatabaseCandidate();
      }
    }

    this.setKeyboardLayoutField();
  }

  /**
   * Return the first name control of the proposal form.
   */
  get firstName() {
    return this.proposalForm.get('firstName');
  }

  /**
   * Return the last name control of the proposal form.
   */
  get lastName() {
    return this.proposalForm.get('lastName');
  }

  /**
   * Return the gender control of the proposal form
   */
  get gender() {
    return this.proposalForm.get('gender');
  }

  /**
   * Return the part of referral control of the proposal form.
   */
  get partOfReferral() {
    return this.proposalForm.get('partOfReferral');
  }

  /**
   * Return the referrer control of the proposal form.
   */
  get referrer() {
    return this.proposalForm.get('referrer');
  }

  /**
   * Return the resoruce type control of the proposal form.
   */
  get type() {
    return this.proposalForm.get('type');
  }

  /**
   * Return the company control of the proposal form.
   */
  get company() {
    return this.proposalForm.get('company');
  }

  /**
   * Return the work permit necessary control of the proposal form.
   */
  get isWorkPermitNecessary() {
    return this.proposalForm.get('isWorkPermitNecessary');
  }

  /**
   * Return the start date control of the proposal form.
   */
  get startDate() {
    return this.proposalForm.get('startDate');
  }

  /**
   * Return the end date control of the proposal form.
   */
  get endDate() {
    return this.proposalForm.get('endDate');
  }

  /**
   * Return the hardware control of the laptop form.
   */
  get hardware() {
    return this.laptopForm.get('hardware');
  }

  /**
   * Return the computerModel control of the laptop form.
   */
  get computerModel() {
    return this.laptopForm.get('computerModel');
  }

  /**
   * Return the keyboardLayout control of the laptop form.
   */
  get keyboardLayout() {
    return this.laptopForm.get('keyboardLayout');
  }

  /**
   * Return the operatingSystem control of the laptop form.
   */
  get operatingSystem() {
    return this.laptopForm.get('operatingSystem');
  }

  /**
   * Return the screens control of the hardware form.
   */
  get screens() {
    return this.hardwareForm.get('screens');
  }

  /**
   * Return the screens control of the hardware form.
   */
  get comments() {
    return this.hardwareForm.get('comments');
  }

  get isLaptopNecessary() {
    return this.proposalForm.get('laptopNecessary');
  }

  /**
   * Initialize all the value for the proposal form.
   */
  initProposalForm() {
    this.referrer.disable();
    this.referrer.setValue({name: ''});
    this.firstName.setValue(this.candidate.firstName);
    this.lastName.setValue(this.candidate.lastName);
    this.company.setValue(this.candidate.usourceCompany);
  }

  /**
   * Init the form with the value of the candidate coming from the database.
   */
  initFormWithDatabaseCandidate() {
    this.startDate.setValue(
      // @ts-ignore
      DateConvertorService.getNgbDateStructFromString(this.candidateDatabase.startDate.replaceAll('-', '/'))
    );
    if (this.candidateDatabase.endDate) {
      this.endDate.setValue(
        // @ts-ignore
        DateConvertorService.getNgbDateStructFromString(this.candidateDatabase.endDate.replaceAll('-', '/'))
      );
    }
    if (this.candidateDatabase.referrerId) {
      this.partOfReferral.setValue(true);
      this.findReferrerById(this.candidateDatabase.referrerId).then(data => this.referrer.setValue(data));
    }
    this.type.setValue(this.candidateDatabase.resourceType);
    this.company.setValue(this.candidateDatabase.company);
  }

  /**
   * function of Bootstrap.
   * @param x - The text to parse.
   */
  formatter = (x: { name: string }) => `${x.name}`;

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
          this.referrer.enable();
          this.loadingService.hide();
        });
      } else {
        this.referrer.enable();
      }
    } else {
      this.referrer.setValue(null);
      this.referrer.disable();
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

  /**
   * Initialize the hardware and laptop form
   */
  initHardwareLaptopForm() {
    this.hardware.setValue('0');
    this.operatingSystem.setValue('DEFAULT');
    this.screens.setValue(0);
    this.hardwareForm.disable();
  }

  /**
   * This method sets the form with default values
   * */
  setDefaultForm() {
    this.hardwareDto = this.DEFAULT_HARDWARE;
    this.hardwareDto.hardwareRequired = this.hardware.value === '1';
    this.setForm();
  }

  /**
   * This method updates the form object and disables the form
   * */
  disableHardwareForm() {
    if (this.hardware.value === '1') {
      this.setDefaultForm();
    } else {
      this.hardwareDto = <HardwareDto>{
        screens: 0,
        comments: '',
        hardwareRequired: false,
        assets: []
      };

      this.selectedAssets = [];
      this.setForm();
    }

    this.hardwareUpdated();
    this.updateLaptopModel(this.company.value);
    this.disableFields();
  }

  /**
   * This method sets the form values
   * */
  private setForm() {
    if (this.hardwareDto) {
      this.screens.setValue(this.hardwareDto.screens);
      if (this.hardwareDto.assets != null) {
        this.selectedAssets = Array.from(this.hardwareDto.assets);
      }
      this.comments.setValue(this.hardwareDto.comments);
    }
  }

  /**
   * This method emits all the form field values as an aggregate object
   * */
  hardwareUpdated() {
    const hardwareRequired = this.hardware.value === '1';

    this.hardwareDto = {
      screens: hardwareRequired ? this.screens.value : 0,
      comments: hardwareRequired ? this.comments.value : this.DEFAULT_HARDWARE.comments,
      hardwareRequired,
      assets: this.selectedAssets
    };
    this.setForm();
  }

  /**
   * Updates the list of laptops and preselect the default one and the keyboard
   * @param company - candidate's company
   * @param force - force update
   */
  updateLaptopModel(company: string, force: boolean = false) {
    if (company) {
      if (force) {
        this.candidateService.getLaptopModelsByCompany(company)
          .then(data => {
            this.laptopModelList = data.map(x => x.laptopName);
            const onSite: EDefaultLaptopOnSiteType = this.hardware.value === '1' ? 'ON_SITE' : 'OFF_SITE';
            const defaultSettings: LaptopKeyboardDto = data.find(
              ent => ent.linkType === 'DEFAULT'
                && (ent.onSiteType === 'BOTH' || ent.onSiteType === onSite)
            );
            if (defaultSettings) {
              this.computerModel.setValue(defaultSettings.laptopName);
              this.keyboardLayout.setValue(defaultSettings.keyboardName);
            } else {
              this.clearFields();
            }
          });
      } else {
        this.clearFields();
      }
    } else {
      this.clearFieldsAndList();
    }
  }

  /**
   * This method checks and disables the form
   * */
  private disableFields() {
    const disabled = this.hardware.value === '0';
    disabled ? this.screens.disable() : this.screens.enable();
    disabled ? this.comments.disable() : this.comments.enable();
    this.checkboxDisable = disabled;
  }

  /**
   * Set clear fields
   */
  clearFields() {
    this.computerModel.setValue(null);
    this.keyboardLayout.setValue(null);
    this.operatingSystem.setValue('DEFAULT');
  }

  /**
   * clear fields and laptop list
   */
  clearFieldsAndList() {
    this.laptopModelList = Array.from(this.laptopModelListCopy);
    this.clearFields();
  }

  /**
   * This method updates the selected / unselected assets
   * @param event the event triggered
   * @param asset the asset to update
   */
  updateAsset(event, asset: AssetDto) {
    if (event.target.checked) {
      this.selectedAssets.push(asset);
    } else {
      const index = this.selectedAssets.findIndex(selectedAsset => selectedAsset.name === asset.name);
      this.selectedAssets.splice(index, 1);
    }
    this.hardwareUpdated();
  }

  /**
   * Is asset checked
   * @param asset to check
   */
  isChecked(asset: AssetDto): boolean {
    const assetFound = this.selectedAssets.find(selectedAsset => selectedAsset.name === asset.name);
    return assetFound && assetFound.id > -1;
  }

  /**
   * Build the proposal according to the type of resource.
   */
  buildProposal(withoutCar = false) {
    this.hardwareDto.hardwareRequired = this.isLaptopNecessary.value;
    const proposal: CandidateProposalDto = {
      srCandidateId: this.candidate.srCandidateId,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      gender: this.gender.value,
      startDate: DateConvertorService.convertDateToString(this.startDate.value),
      endDate: this.endDate.value
        ? DateConvertorService.convertDateToString(this.endDate.value)
        : null,
      referrer: this.partOfReferral.value
        ? this.referrer.value.name
        : null,
      referrerAccount: this.partOfReferral.value
        ? this.referrer.value.account
        : null,
      resourceType: this.type.value,
      company: this.company.value,
      manager: this.responsibleAtArhsComponent.getManager(),
      inductionResponsible: this.responsibleAtArhsComponent.getInductionResponsible(),
      mentor: this.responsibleAtArhsComponent.getMentor(),
      hardware: this.hardwareDto,
      keyboardModel: this.keyboardLayout.value,
      laptopModel: this.computerModel.value,
      onSite: Boolean(Number(this.hardware.value)),
      operatingSystem: this.operatingSystem.value,
      type: 'CandidateProposalDto',
      isWorkPermitNecessary: Boolean(this.isWorkPermitNecessary.value),
      isLaptopNecessary: this.isLaptopNecessary.value
    };
    if (this.type.value === this.employee || this.type.value === this.overhead) {
      const employeeProposal = proposal as CandidateEmployeeProposalDto;
      employeeProposal.type = this.type.value;
      employeeProposal.address = this.employeeProposalComponent.address.value;
      employeeProposal.jobPosition = this.employeeProposalComponent.jobPosition.value;
      employeeProposal.jobTitle = this.employeeProposalComponent.jobTitle.value;
      employeeProposal.isNewGraduate = this.employeeProposalComponent.youngGraduate.value;
      employeeProposal.salary = withoutCar && this.employeeProposalComponent.hasSecondSalary.value
        ? this.employeeProposalComponent.secondSalary.value
        : this.employeeProposalComponent.salary.value;
      employeeProposal.carCategory = !withoutCar && this.employeeProposalComponent.carCategory.value
          ? this.employeeProposalComponent.carCategory.value
          : 'No car';
      employeeProposal.insurancePackage = this.employeeProposalComponent.insurancePackage.value
          ? this.employeeProposalComponent.insurancePackage.value
          : false;
      employeeProposal.mealVouchers = this.employeeProposalComponent.mealVouchers.value
          ? this.employeeProposalComponent.mealVouchers.value
          : false;
      employeeProposal.gsm = this.employeeProposalComponent.gsm.value
          ? this.employeeProposalComponent.gsm.value
          : false;
      return employeeProposal;
    }
    if (this.type.value === this.freelance) {
      const freelanceProposal = proposal as CandidateFreelanceProposalDto;
      freelanceProposal.type = this.type.value;
      freelanceProposal.contractingCompany = this.freelancerProposalComponent.contractingCompany.value;
      freelanceProposal.companyAddress = this.freelancerProposalComponent.companyAddress.value;
      freelanceProposal.vatNumber = this.freelancerProposalComponent.vatNumber.value;
      freelanceProposal.legalRepresentative = this.freelancerProposalComponent.legalRepresentative.value;
      freelanceProposal.customer = this.freelancerProposalComponent.customer.value;
      freelanceProposal.customerContractNumber = this.freelancerProposalComponent.customerContractNumber.value;
      freelanceProposal.customerAddress = this.freelancerProposalComponent.customerAddress.value;
      freelanceProposal.durationWorkingDay = this.freelancerProposalComponent.durationInWorkingDays.value;
      freelanceProposal.price = this.freelancerProposalComponent.price.value;
      freelanceProposal.professionalEmailAddress = this.freelancerProposalComponent.professionalEmailAddress.value;
      freelanceProposal.description = this.freelancerProposalComponent.description.value;
      return freelanceProposal;
    }
    return proposal;
  }

  /**
   * Open the modal with the common values.
   */
  async openMailModal() {
    const mailsInfo = await Promise.all([
      this.mailService.retrieveAllMails(),
      this.mailService.retrieveCurrentUserMail()
    ]).then(res => {
      return {
        mailList: res[0],
        currentUserMail: res[1]
      };
    });

    const ngbModalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop : 'static',
      keyboard : false
    };
    const modal = this.modalService.open(SendMailComponent, ngbModalOptions);
    const recipients = MailUtils.retrieveRecruiterMail(this.candidate.usourceCompany);
    recipients.cc.push(mailsInfo.currentUserMail.email);
    modal.componentInstance.selectedMails = recipients.to;
    modal.componentInstance.selectedCCMails = recipients.cc;
    modal.componentInstance.mailList = mailsInfo.mailList;
    return modal;
  }

  /**
   * Open the mail modal with the create contract parameter.
   */
  async openOfferMailModal() {
    if (this.checkCannotSent()) {
      this.notificationService.addWarningToast('Complete all required fields');
    } else {
      this.candidate.usourceCompany = this.company.value;
      const modal = await this.openMailModal();
      if (this.isUpdateOffer) {
        modal.componentInstance.defaultSubject = MailUtils.createUpdateOfferSubject(this.candidate.fullName);
        modal.componentInstance.defaultBody = MailUtils.createUpdateOfferBody(this.candidate.fullName);
        modal.componentInstance.title = MailUtils.DEFAULT_UPDATE_OFFER_TITLE;
      } else {
        modal.componentInstance.defaultSubject = MailUtils.createCreateOfferSubject(this.candidate.fullName);
        modal.componentInstance.defaultBody = MailUtils.createCreateOfferBody(this.candidate.fullName, this.candidate.candidateAccount);
        modal.componentInstance.title = MailUtils.DEFAULT_CREATE_OFFER_TITLE;
      }
      modal.componentInstance.isProposal = true;
      modal.componentInstance.candidateProposal = this.buildProposal();
      if(this.employeeProposalComponent && this.employeeProposalComponent.hasSecondSalary.value) {
        modal.componentInstance.candidateProposalWithoutCar = this.buildProposal(true);
      }
      modal.result.then(mail => {
        if (mail) {
          const requestAuthor: CandidateRequestAuthorDto = {
            author: '',
            lastRequest: this.isUpdateOffer
              ? 'Update an offer'
              : 'Create an offer',
            srCandidateId: this.candidate.srCandidateId,
            srJobId: this.candidate.srJobId
          };
          if (this.type.value === this.employee) {
            const recruiterRequest: RecruiterMailEmployeeRequestDto = {
              type: this.employee,
              mail: mail,
              requestAuthor: requestAuthor,
              // @ts-ignore
              employeeProposal: this.buildProposal()
            };
            this.sendRecruiterRequest(recruiterRequest);
          } else if (this.type.value === this.overhead) {
            const recruiterRequest: RecruiterMailEmployeeRequestDto = {
              type: this.overhead,
              mail: mail,
              requestAuthor: requestAuthor,
              // @ts-ignore
              employeeProposal: this.buildProposal()
            };
            this.sendRecruiterRequest(recruiterRequest);
          } else if (this.type.value === this.freelance) {
            const recruiterRequest: RecruiterMailFreelanceRequestDto = {
              type: this.freelance,
              mail: mail,
              requestAuthor: requestAuthor,
              freelanceProposal: this.buildProposal()
            };
            this.sendRecruiterRequest(recruiterRequest);
          } else {
            const recruiterRequest: RecruiterMailDefaultRequestDto = {
              type: 'default',
              mail: mail,
              requestAuthor: requestAuthor,
              candidateProposal: this.buildProposal()
            };
            this.sendRecruiterRequest(recruiterRequest);
          }
        }
      });
    }
  }

  /**
   * Send the recruiter request.
   * @param recruiterRequest to send.
   */
  sendRecruiterRequest(recruiterRequest: RecruiterMailRequestDto) {
    this.mailService.sendRecruiterRequest(recruiterRequest).then(() => {
      this.isCreateSuccess = true;
      this.notificationService.addSuccessToast('Mail successfully sent');
      this.router.navigate(['/onboarding/recruiter-dashboard']);
    });
  }

  /**
   * Check if the proposal can be sent.
   */
  checkCannotSent() {
    if (this.type.value === this.employee || this.type.value === this.overhead) {
      return this.proposalForm.invalid || this.employeeProposalComponent.proposalRequestInformationForm.invalid
        || this.employeeProposalComponent.packageForm.invalid || this.laptopForm.invalid;
    } else if (this.type.value === this.freelance) {
      return this.proposalForm.invalid || this.freelancerProposalComponent.consultantMissionForm.invalid
        || this.freelancerProposalComponent.contractingCompanyCustomerInformationForm.invalid || this.laptopForm.invalid;
    } else {
      return this.proposalForm.invalid || this.laptopForm.invalid;
    }
  }

  /**
   * Return the referrer if exists.
   * @param id of the referrer.
   */
  async findReferrerById(id: number) {
    if (!this.referrers.length) {
      this.loadingService.display();
      await this.referrerService.getReferrers().then((data: ShortResourceDto[]) => {
        this.referrers = data;
        this.proposalForm.get('referrer').enable();
        this.loadingService.hide();
      });
    } else {
      this.proposalForm.get('referrer').enable();
    }
    return this.referrers.find(referrer => id === referrer.id);
  }

  /**
   * Set the keyboard value & availability according to the computer model value
   */
  setKeyboardLayoutField(){
    if(!this.computerModel.value || this.computerModel.value === 'No laptop'){
      this.keyboardLayout.setValue('No keyboard');
      this.keyboardLayout.disable();
    } else {
      this.keyboardLayout.enable();
    }
  }

  /**
   * Change all the values of the hardware menu (laptop information + hardware) when the laptop isn't necessary
   */
  laptopNecessaryEvent() {
    if (!this.isLaptopNecessary.value) {
      this.hardware.setValue('0');
      this.disableHardwareForm();
      this.computerModel.setValue('No laptop');
    }
  }
}
