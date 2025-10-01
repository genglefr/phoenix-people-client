import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {FullResourceDto} from '../../../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConnectedUserNotifierService} from '../../../services/connected-user-notifier.service';
import {ResourceService} from '../../../services/Resource/resource.service';
import {NotificationService} from '../../../services/notification.service';
import {take} from 'rxjs/operators';
import {mailValidator} from '../../../validators/MailValidator';
import {yamlValidator} from '../../../validators/YamlValidator';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit {

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


  personalUsagePolicyForm = new FormGroup({
    'showBirthDay': new FormControl(''),
    'showJobAnniversary': new FormControl(''),
    'showUserPictureOnTools': new FormControl('')
  });

  publicSSHKeysForm = new FormGroup({
    'accentureMail': new FormControl('', [mailValidator()]),
    'publicSshKeysYaml': new FormControl('', [yamlValidator()])
  });

  displayedUserPicture: any = '';

  user: FullResourceDto;

  evokoPin: string;

  constructor(private route: ActivatedRoute, public activeModal: NgbActiveModal, private toaster: NotificationService,
              private notifier: ConnectedUserNotifierService, private resourceService: ResourceService) {
    this.user = this.notifier.getUser();
  }

  ngOnInit() {
    this.initUI();
    this.getOrUpdatePin(false);
  }

  /**
   * Initializes the forms
   */
  initUI() {
    if (this.user) {
      // Personal contacts
      this.contactForm.get('landline').setValue(this.user.landLinePhone);
      this.contactForm.get('messenger').setValue(this.user.instantMessagingAddress);
      this.contactForm.get('customerMail').setValue(this.user.customerEmail);
      this.contactForm.get('proMail').setValue(this.user.professionalMail);
      this.contactForm.get('mobile').setValue(this.user.mobilePhone);
      // Emergency contacts
      if (this.user.emergencyContacts && this.user.emergencyContacts.length) {
        this.emergencyContactForm.get('fullNameContact1').setValue(this.user.emergencyContacts[0]
          ? this.user.emergencyContacts[0].fullName : '');
        this.emergencyContactForm.get('relationshipContact1').setValue(this.user.emergencyContacts[0]
          ? this.user.emergencyContacts[0].relationship : '');
        this.emergencyContactForm.get('phoneNumberContact1').setValue(this.user.emergencyContacts[0]
          ? this.user.emergencyContacts[0].phoneNumber : '');
        this.emergencyContactForm.get('fullNameContact2').setValue(this.user.emergencyContacts[1]
          ? this.user.emergencyContacts[1].fullName : '');
        this.emergencyContactForm.get('relationshipContact2').setValue(this.user.emergencyContacts[1]
          ? this.user.emergencyContacts[1].relationship : '');
        this.emergencyContactForm.get('phoneNumberContact2').setValue(this.user.emergencyContacts[1]
          ? this.user.emergencyContacts[1].phoneNumber : '');
      }
      this.emergencyContactForm.get('contactComment').setValue(this.user.emergencyComment ? this.user.emergencyComment.comment : '');
      // Check all checkboxes in tab "Personal usage policy"
      this.personalUsagePolicyForm.get('showBirthDay').setValue(this.user.birthSend);
      this.personalUsagePolicyForm.get('showJobAnniversary').setValue(this.user.showJobAnniversary);
      this.personalUsagePolicyForm.get('showUserPictureOnTools').setValue(this.user.usePicture);

      this.publicSSHKeysForm.get('accentureMail').setValue(this.user.accentureMail);
      this.publicSSHKeysForm.get('publicSshKeysYaml').setValue(this.user.publicSshKeysYaml);

      this.initPicture();
    }
  }

  /**
   * Updates the user's contacts and preferences
   */
  updateProfile() {
    this.resourceService.updateMyDetails(this.getDataModel())
      .then(() => {
        this.toaster.addSuccessToast('The profile has been updated successfully.');
        this.activeModal.close();
      }).catch((err) => {
      this.toaster.addErrorToast('Error updating the profile.');
    });
  }

  /**
   * Create the model to update/save
   */
  private getDataModel(): FullResourceDto {
    this.user.emergencyContacts = [{
      id: (this.user && this.user.emergencyContacts && this.user.emergencyContacts.length && this.user.emergencyContacts[0])
        ? this.user.emergencyContacts[0].id
        : null,
      resource: (this.user && this.user.emergencyContacts && this.user.emergencyContacts.length && this.user.emergencyContacts[0])
        ? this.user.emergencyContacts[0].resource
        : null,
      fullName: this.emergencyContactForm.get('fullNameContact1').value,
      relationship: this.emergencyContactForm.get('relationshipContact1').value,
      phoneNumber: this.emergencyContactForm.get('phoneNumberContact1').value
    },
      {
        id: (this.user && this.user.emergencyContacts && this.user.emergencyContacts.length > 1 && this.user.emergencyContacts[1])
          ? this.user.emergencyContacts[1].id
          : null,
        resource: (this.user && this.user.emergencyContacts && this.user.emergencyContacts.length > 1 && this.user.emergencyContacts[1]) ?
          this.user.emergencyContacts[1].resource
          : null,
        fullName: this.emergencyContactForm.get('fullNameContact2').value,
        relationship: this.emergencyContactForm.get('relationshipContact2').value,
        phoneNumber: this.emergencyContactForm.get('phoneNumberContact2').value
      }];

    this.user.emergencyComment = {
      id: (this.user && this.user.emergencyComment) ? this.user.emergencyComment.id : null,
      resource: (this.user && this.user.emergencyComment) ? this.user.emergencyComment.resource : null,
      comment: this.emergencyContactForm.get('contactComment').value
    };

    this.user.landLinePhone = this.contactForm.get('landline').value;
    this.user.instantMessagingAddress = this.contactForm.get('messenger').value;
    this.user.customerEmail = this.contactForm.get('customerMail').value;
    this.user.professionalMail = this.contactForm.get('proMail').value;
    this.user.mobilePhone = this.contactForm.get('mobile').value;

    this.user.showJobAnniversary = this.personalUsagePolicyForm.get('showJobAnniversary').value;
    this.user.birthSend = this.personalUsagePolicyForm.get('showBirthDay').value;
    this.user.usePicture = this.personalUsagePolicyForm.get('showUserPictureOnTools').value;

    this.user.accentureMail = this.publicSSHKeysForm.get('accentureMail').value;
    this.user.publicSshKeysYaml = this.publicSSHKeysForm.get('publicSshKeysYaml').value;

    return this.user;
  }

  /**
   * Loads the user's picture
   */
  private initPicture() {
    this.resourceService.getCroppedImage(this.user.account).then(res => {
      const reader: FileReader = new FileReader();
      reader.onloadend = (e) => {
        this.displayedUserPicture = reader.result;
      };

      reader.readAsDataURL(res);
    });
  }

  /**
   * generate new pin and update existing
   */
  getOrUpdatePin(update: boolean) {
    this.resourceService.getEvokoPin(this.user.account, update)
      .pipe(take(1))
      .subscribe((pin: string) => {
        this.evokoPin = pin;
        if (update) {
          this.toaster.addSuccessToast('The evoko pin has been generated successfully.');
        }
      });
  }
}
