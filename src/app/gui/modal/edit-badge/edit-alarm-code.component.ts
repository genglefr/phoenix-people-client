import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {NgbActiveModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AlarmCodeDto, ResourceFullNameAndAccountDto} from '../../../model';
import {AlarmCodeService} from '../../../services/Alarm/alarm-code.service';
import {NotificationService} from '../../../services/notification.service';
import {LoadingService} from '../../../services/loading.service';

declare const accentFold: any;

@Component({
  selector: 'app-edit-alarm-code',
  templateUrl: './edit-alarm-code.component.html',
  styleUrls: ['./edit-alarm-code.component.sass']
})
export class EditAlarmCodeComponent implements OnInit {

  @Input()
  isCreation: boolean;

  @Input()
  alarmCodeToEdit: AlarmCodeDto;

  @Input()
  resources: ResourceFullNameAndAccountDto[] = [];

  @ViewChild('exitButton') exitButton;

  @ViewChild('instanceOwner') instanceOwner: NgbTypeahead;
  clickOwner = new Subject<string>();

  /** FORMS **/
  alarmCodeForm = new FormGroup({
    'floor': new FormControl(null, [Validators.required]),
    'code': new FormControl(null),
    'owner': new FormControl(null),
    'comment': new FormControl(null, [Validators.maxLength(4000)])
  });
  constructor(private activeModal: NgbActiveModal, private alarmCodeService: AlarmCodeService,
              private notificationService: NotificationService, private loadingService: LoadingService) { }

  ngOnInit() {
    if (this.alarmCodeToEdit.id) {
      this.setForm(this.alarmCodeToEdit);
    } else {
      this.clearForm();
    }
  }


  /**
   * Closes the modal.
   */
  closeModal() {
    if (this.alarmCodeForm.pristine || window.confirm('Are you sure you want to discard your changes?')) {
      this.activeModal.close();
    }
  }

  /**
   * Checks if the resource included the text value.
   * @param text the text to check.
   * @param resource the resource to compare the first and last name to.
   */
  checkResourceIncludesOwnerName(text: any, resource: ResourceFullNameAndAccountDto): boolean {
    const firstName = accentFold(resource.firstName);
    const lastName = accentFold(resource.lastName);
    const foldedText = accentFold(String(text).toLowerCase());

    return `${firstName} ${lastName}`.includes(foldedText) ||
      `${lastName} ${firstName}`.includes(foldedText);
  }

  /**
   * Clear the form.
   */
  clearForm() {
    this.alarmCodeForm.reset();
  }

  /**
   * Sets the values of the alarm code to the form.
   * @param alarmCode the alarm code to patch.
   */
  setForm(alarmCode: AlarmCodeDto) {
    this.floor.patchValue(alarmCode.floor);
    this.owner.patchValue(alarmCode.accountList);
    this.code.patchValue(alarmCode.code);
    this.comment.patchValue(alarmCode.comment);
  }

  /**
   * Retrieve the floor control.
   */
  get floor(): AbstractControl {
    return this.alarmCodeForm.get('floor');
  }

  /**
   * Retrieve the owner control.
   */
  get owner(): AbstractControl {
    return this.alarmCodeForm.get('owner');
  }

  /**
   * Retrieve the code
   */
  get code(): AbstractControl {
    return this.alarmCodeForm.get('code');
  }

  /**
   * Retrieve comment.
   */
  get comment(): AbstractControl {
    return this.alarmCodeForm.get('comment');
  }

  /**
   * Save changes
   */
  saveChanges() {
    this.saveBadge({
      id: this.alarmCodeToEdit.id,
      floor: this.floor.value,
      code: this.code.value,
      accountList: this.owner.value ? this.owner.value : [],
      comment: this.comment.value,
    } as AlarmCodeDto);
  }

  /**
   * Saves the badge.
   */
  saveBadge(alarmCode: AlarmCodeDto) {
    this.loadingService.display();
    this.loadingService.setIsRouteChanging(true);
    this.alarmCodeService.createOrUpdateAlarmCode(alarmCode)
      .then(() => {
        // @ts-ignore
        this.notificationService.addSuccessToast(`The alarm code has been ${this.alarmCodeToEdit.id ? 'updated' :
          'created'} successfully`);
        this.activeModal.close(alarmCode);
      })
      .catch(error => {
        this.loadingService.setIsRouteChanging(false);
        this.loadingService.hide();
        console.error(error);
      });
  }
}
