import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { AssetDto, CandidateDto, FileWithDataDto, FormDataDto, HardwareDto, MailDto, RecruiterBoardResourceDto } from '../../../model';
import { CandidateService } from '../../../services/Candidate/candidate.service';
import { FileService } from '../../../services/File/file.service';
import { MailService } from '../../../services/Mail/mail.service';
import { NotificationService } from '../../../services/notification.service';
import { OnBoardingService } from '../../../services/OnBoarding/on-boarding.service';
import { MailUtils } from '../../../utils/MailUtils';
import { manualReminderValidator } from '../../../validators/manual-reminder.directive';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.sass']
})
export class SendMailComponent implements OnInit, AfterViewInit {

  constructor(private activeModal: NgbActiveModal,
              private mailService: MailService,
              private notificationService: NotificationService,
              private fileService: FileService,
              private onboardingService: OnBoardingService,
              private candidateService: CandidateService) {
  }

  mailList: string[] = [];
  mailToList: string[] = [];
  mailCCList: string[] = [];
  mailBccList: string[] = [];
  selectedMails: string[] = [];
  selectedCCMails: string[] = [];
  selectedBCCMails: string[] = [];
  resourceList: string[] = [];
  sendMailForm = new FormGroup({
    'mail-to': new FormControl(''),
    'mail-cc': new FormControl(''),
    'mail-bcc': new FormControl(''),
    'mail-subject': new FormControl('', Validators.required),
    'mail-address': new FormControl(''),
    'comment': new FormControl(''),
    'mail-referrer': new FormControl(null),
    'mail-body': new FormControl('', Validators.required),
  });
  title: string;
  addressRequired = false;
  commentAvailable = false;
  referrerOption = false;
  candidate: RecruiterBoardResourceDto;
  defaultSubject: string;
  defaultBody: string;
  mailToSend: MailDto = {
    body: '',
    fromMail: '',
    subject: '',
    toMails: [],
    ccMails: [],
    bccMails: [],
    attachments: [],
  };
  formData: FormDataDto;
  assets: AssetDto[];
  bindAddMail: Function;
  newAttachmentsFile: File[] = [];
  laptopForm = new FormGroup({
    'hardware': new FormControl('0'),
    'computerModel': new FormControl(null),
    'keyboardLayout': new FormControl(null),
    'operatingSystem': new FormControl('')
  });
  hardwareForm = new FormGroup({
    'screens': new FormControl(0),
    'comments': new FormControl(''),
    'assets': new FormControl([])
  });

  isProposal = false;
  candidateProposal: any;
  candidateProposalWithoutCar: any;
  /**
   * List of laptop model.
   */
  laptopModelList: string[];
  showHardwareTab: boolean = false;

  ngOnInit() {
    this.bindAddMail = this.addMail.bind(this);
    this.mailSubjectForm.setValue(this.defaultSubject);
    this.mailBodyForm.setValue(this.defaultBody);
    if (this.addressRequired) {
      this.mailAddressForm.setValidators(Validators.required);
      this.setUpBodyContent();
      this.mailAddressForm.valueChanges.subscribe(this.setUpBodyContent.bind(this));
      this.mailReferrerForm.valueChanges.subscribe(this.setUpBodyContent.bind(this));
      this.commentForm.valueChanges.subscribe(this.setUpBodyContent.bind(this))
      this.laptopForm.valueChanges.subscribe(this.setUpBodyContent.bind(this));
      this.hardwareForm.valueChanges.subscribe(this.setUpBodyContent.bind(this));
    }
    if (this.showHardwareTab) {
      this.initLaptopForm(this.candidate);
      this.initHardwareForm(this.candidate.hardware);
    }
  }

  ngAfterViewInit() {
    this.sendMailForm.setValidators(manualReminderValidator);
  }

  /**
   * Get mail to from form.
   */
  get mailToForm() {
    return this.sendMailForm.get('mail-to');
  }

  /**
   * Get mail to from form.
   */
  get mailCCForm() {
    return this.sendMailForm.get('mail-cc');
  }

  /**
   * Get mail to from form.
   */
  get mailBCCForm() {
    return this.sendMailForm.get('mail-bcc');
  }

  /**
   * Get mail subject from form.
   */
  get mailSubjectForm() {
    return this.sendMailForm.get('mail-subject');
  }

  /**
   * Get comment from form.
   */
  get commentForm() {
    return this.sendMailForm.get('comment');
  }

  /**
   * Get mail address from form.
   */
  get mailAddressForm() {
    return this.sendMailForm.get('mail-address');
  }

  /**
   * Get mail address from form.
   */
  get mailReferrerForm() {
    return this.sendMailForm.get('mail-referrer');
  }

  /**
   * Get mail body from form.
   */
  get mailBodyForm() {
    return this.sendMailForm.get('mail-body');
  }

  /**
   * Return form disabled if laptop not on site
   */
  get isHardwareRequired(): boolean {
    return this.laptopForm.get('hardware').value === '1';
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close(false);
  }

  /**
   * Send the mail when clicking on send.
   */
  sendMail() {
    if(this.showHardwareTab) {
      this.candidateService.updateCandidateHardware(this.buildCandidateModel())
        .then(() => this.notificationService.addSuccessToast('Candidate successfully saved'));
    }
    this.buildMailTask().then(() => {
      this.activeModal.close(this.mailToSend);
    });
  }

  /**
   * Builds candidate model
   * @return the candidate model
   */
  private buildCandidateModel(): CandidateDto {
    return {
      id: this.candidate.rscId,
      laptopModel: this.laptopForm.get('computerModel').value,
      keyboardModel: this.laptopForm.get('keyboardLayout').value,
      operatingSystem: this.laptopForm.get('operatingSystem').value,
      hardware: this.buildHardwareModel(),
    } as CandidateDto;
  }

  /**
   * Builds hardware model
   * @return the hardware model
   */
  private buildHardwareModel(): HardwareDto {
    return {
      screens: this.hardwareForm.get('screens').value,
      assets: this.hardwareForm.get('assets').value,
      comments: this.hardwareForm.get('comments').value,
      hardwareRequired: this.isHardwareRequired
    };
  }

  /**
   * Add an email to the list.
   * @param email to add.
   */
  addMail(email) {
    if (new FormControl(email, Validators.email).errors) {
      this.notificationService.addErrorToast('Mail format is incorrect');
    } else {
      return email;
    }
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
    this.disableFields();
  }

  /**
   * Initialize the hardware form
   * @param userToShow The data that should be displayed
   */
  initLaptopForm(user: RecruiterBoardResourceDto) {
    this.laptopForm.reset();
    this.laptopForm.get('hardware').setValue(!user.hardware
      ? '0'
      : user.hardware.hardwareRequired ? '1' : '0'
    );
    this.laptopForm.get('keyboardLayout').setValue(!user.keyboardModel ? null : user.keyboardModel);
    this.laptopForm.get('operatingSystem').setValue(!user.operatingSystem ? 'DEFAULT' : user.operatingSystem);
    this.laptopForm.get('computerModel').setValue(!user.laptopModel ? null : user.laptopModel);
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
   * This method sets the form with default values
   * */
  setDefaultForm() {
    this.hardwareForm.get('screens').setValue(2);
    this.hardwareForm.get('comments').setValue('');
    this.hardwareForm.get('assets').setValue([...this.assets]);
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
   * Build the mail information.
   */
  async buildMailTask() {
    this.selectedMails.forEach(elt => {
      this.mailToSend.toMails.push({ email: elt });
    });
    this.selectedCCMails.forEach(elt => {
      this.mailToSend.ccMails.push({ email: elt });
    });
    this.selectedBCCMails.forEach(elt => {
      this.mailToSend.bccMails.push({ email: elt });
    });
    this.mailToSend.subject = this.mailSubjectForm.value;
    this.mailToSend.body = this.mailBodyForm.value;
    this.mailToSend.candidateProposalDtoList = [];
    if (this.candidateProposal) {
      this.mailToSend.candidateProposalDtoList.push(this.candidateProposal);
    }

    if (this.candidateProposalWithoutCar) {
      this.mailToSend.candidateProposalDtoList.push(this.candidateProposalWithoutCar);
    }
    await this.addAttachmentToMail();
  }

  /**
   * Add files from the import button.
   * @param files to add
   */
  addFile(files) {
    Array.from(files)
      .filter(elt => this.fileService.checkIfTypeOfAttachmentIsValid(elt))
      .forEach(elt => this.newAttachmentsFile.push(elt as File));
    this.sendMailForm.markAsDirty();
  }

  /**
   * Add file from the drop event.
   * @param $event drop event
   */
  addDropFile($event: any) {
    this.addFile($event);
  }

  /**
   * Download a file that as been added in the list.
   * @param file - The file to download.
   */
  downloadFileFromClient(file: File) {
    fileSaver.saveAs(file.slice(), file.name);
  }

  /**
   * Remove file from attachments list.
   */
  removeFile(file: File) {
    this.sendMailForm.markAsDirty();
    const index = this.newAttachmentsFile.indexOf(file);
    this.newAttachmentsFile.splice(index, 1);
  }

  /**
   * Add attachment to the mail.
   */
  async addAttachmentToMail() {
    if (this.newAttachmentsFile.length > 0) {
      await this.buildAttachmentsDto(this.newAttachmentsFile).then(data => {
        this.mailToSend.attachments = data;
      });
    }
  }

  /**
   * Build FileWithDataDto from files given as parameters.
   * return list of FileWithDataDto.
   */
  buildAttachmentsDto(files: File[]): Promise<FileWithDataDto[]> {
    const promises = files.map(elt => this.fileService.convertToFileWithDataDto(elt));
    this.sendMailForm.markAsDirty();
    return Promise.all(promises);
  }

  /**
   * Download file from the server.
   */
  downloadFileFromServer(proposal, fileName) {
    this.onboardingService.downloadProposal(proposal).then(res => {
      const blob: any = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(url, fileName);
    });
  }

  /**
   * Define the fileName of the proposal.
   */
  proposalFileName(prefix, proposal) {
    const firstName = proposal.firstName;
    const lastName = proposal.lastName;
    return `${prefix} - ${firstName} ${lastName} - ${moment().format('DDMMYYYY')}.docx`;
  }

  /**
   * Set up body content
   */
  setUpBodyContent() {
    if (!this.mailAddressForm.value || !this.mailAddressForm.value.trim()) {
      this.mailBodyForm.setValue('');
      this.mailBodyForm.disable();
    } else {
      this.mailBodyForm.setValue(
        MailUtils.createCreateContractWithAddressBody(
          this.candidate.fullName,
          this.mailAddressForm.value,
          this.mailReferrerForm.value,
          this.laptopForm.dirty || this.hardwareForm.dirty,
          this.commentForm.value
        )
      );
      this.mailBodyForm.enable();
    }
  }
}
