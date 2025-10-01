import {Component, OnInit} from '@angular/core';
import {
  AssetDto,
  HardwareDto,
  HardwareRequestResourceDto,
  LaptopKeyboardDto,
  LightFormDataDto
} from '../../model';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../services/User/user.service';
import {ActivatedRoute} from '@angular/router';
import {CandidateService} from '../../services/Candidate/candidate.service';
import {ResourceService} from '../../services/Resource/resource.service';
import {NotificationService} from '../../services/notification.service';
import {Subject} from 'rxjs';
import {exhaustMap} from 'rxjs/operators';
import {DateConvertorService} from '../../services/date-convertor.service';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hardware-request',
  templateUrl: './hardware-request.component.html',
  styleUrls: ['./hardware-request.component.sass']
})
export class HardwareRequestComponent implements OnInit {

  // possible screens to select
  readonly SCREENS = [0, 1, 2, 3, 4];

  readonly DEFAULT_HARDWARE: HardwareDto = {
    screens: 2,
    comments: '',
    hardwareRequired: true,
    assets: []
  };

  today = this.calendar.getToday();

  hardware: HardwareDto;
  assets: AssetDto[];

  resourceForm = new FormGroup({
    'resource': new FormControl(''),
    'deadlineDate': new FormControl('')
  });
  laptopForm = new FormGroup({
    'computerModel': new FormControl(''),
    'keyboardLayout': new FormControl(''),
    'operatingSystem': new FormControl(''),
    'hardware': new FormControl('1'),
  });
  hardwareForm = new FormGroup({
    'screens': new FormControl(0),
    'assets': new FormControl([]),
    'comments': new FormControl('')
  });

  resources: HardwareRequestResourceDto[];
  formData: LightFormDataDto;
  laptopModelList: string[];
  selectedResource: HardwareRequestResourceDto;
  callSubject = new Subject<() => Promise<any>>();

  constructor(private userService: UserService, private route: ActivatedRoute,
              private candidateService: CandidateService, private resourceService: ResourceService,
              private notificationService: NotificationService, private calendar: NgbCalendar) {
    userService.hasAdminRole().then((data: boolean) => {
      if (!data) {
        this.resourceForm.disable();
        this.laptopForm.disable();
        this.hardwareForm.disable();
      }
    });
  }

  get resource(): AbstractControl {
    return this.resourceForm.get('resource');
  }

  get computerModel(): AbstractControl {
    return this.laptopForm.get('computerModel');
  }

  get keyboardLayout(): AbstractControl {
    return this.laptopForm.get('keyboardLayout');
  }

  get operatingSystem(): AbstractControl {
    return this.laptopForm.get('operatingSystem');
  }

  get deadlineDate(): AbstractControl {
    return this.resourceForm.get('deadlineDate');
  }

  get hardwareRequired(): AbstractControl {
    return this.laptopForm.get('hardware');
  }

  get screens(): AbstractControl {
    return this.hardwareForm.get('screens');
  }

  get comments(): AbstractControl {
    return this.hardwareForm.get('comments');
  }

  /**
   * Return form disabled if laptop not on site
   */
  get isHardwareRequired(): boolean {
    return this.laptopForm.get('hardware').value === '1';
  }


  ngOnInit(): void {
    this.hardware = this.DEFAULT_HARDWARE;

    this.resources = this.route.snapshot.data['hardware'];
    this.formData = this.route.snapshot.data['formData'];
    this.assets = this.formData.hardwareAssets;
    this.laptopModelList = this.formData.laptopModels;

    this.callSubject.asObservable().pipe(
      exhaustMap(callback  => callback().catch(() => null))
    ).subscribe();

    this.updateHardwareForm();
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
   * Called when the resource is updated
   * @param hardwareRequestResourceDto the new value
   */
  changeResource(hardwareRequestResourceDto: any) {
    if (hardwareRequestResourceDto) {
      this.selectedResource = hardwareRequestResourceDto;
      if (this.hardwareRequired.value === '1') {
        this.updateLaptopModel(hardwareRequestResourceDto.company);
      } else {
        this.setStandardLaptop(hardwareRequestResourceDto.company);
      }
    } else {
      this.computerModel.setValue(null);
      this.keyboardLayout.setValue(null);
      this.operatingSystem.setValue('DEFAULT');
      this.selectedResource = null;
    }
  }

  /**
   * Send hardware request click
   */
  sendHardwareRequestClick() {
    this.callSubject.next(() => this.sendHardwareRequest());
  }

  /**
   * Called by clicking on the button 'Send hardware request'
   */
  sendHardwareRequest() {
    this.selectedResource.laptopModel = this.computerModel.value;
    this.selectedResource.keyboardModel = this.keyboardLayout.value;
    this.selectedResource.operatingSystem = this.operatingSystem.value;
    this.selectedResource.hardware = this.buildHardwareModel();
    this.selectedResource.deadlineDate = this.deadlineDate.value ? DateConvertorService.convertDateToString(this.deadlineDate.value) : null;
    return this.resourceService.createTicketForAccountCreation(this.selectedResource)
      .then(success => {
        if (success) {
         this.notificationService.addSuccessToast('Hardware information have been sent to infrastructure');
        }
      });
  }

  /**
   * Builds hardware model
   * @return the hardware model
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
   * This method checks and disables the form
   * */
  private disableFields() {
    const disabled = this.hardwareRequired.value === '0';
    disabled ? this.screens.disable() : this.screens.enable();
    disabled ? this.comments.disable() : this.comments.enable();
  }

  /**
   * This method sets the form with default values
   * */
  private setDefaultForm() {
    this.hardwareForm.get('screens').setValue(2);
    this.hardwareForm.get('comments').setValue('');
    this.hardwareForm.get('assets').setValue([...this.assets]);
  }

  /**
   * Updates the list of laptops and preselect the default one and the keyboard
   * @param company - candidate's company
   */
  private updateLaptopModel(company: string) {
    if (company && this.hardwareRequired.value === '1') {
      this.candidateService.getLaptopModelsByCompany(company)
        .then(data => {
          this.laptopModelList = data.map(x => x.laptopName);
          const defaultSettings: LaptopKeyboardDto = data.find(ent => ent.linkType === 'DEFAULT');
          if (defaultSettings) {
            this.computerModel.setValue(defaultSettings.laptopName);
            this.keyboardLayout.setValue(defaultSettings.keyboardName);
            this.operatingSystem.setValue('DEFAULT');
          }
        });
    }
  }

  /**
   * Set standard laptop for some companies
   * @param company the selected resource company
   */
  private setStandardLaptop(company: string) {
    if (company && (company === 'ARHS Luxembourg' || company === 'ARHS Belgium' || company === 'ARHS Digital' ||
      company === 'ARHS Beyond Limit' || company === 'ARHS Technology')) {
      this.computerModel.setValue(this.formData.laptopModels.find(
        elt => elt === 'Standard Laptop : Latitude i7 16GB 256SSD'
      ));
    }
  }
}
