import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ResourceService} from '../../../services/Resource/resource.service';
import {FormControl, FormGroup} from '@angular/forms';
import {FullResourceDto} from '../../../model';

@Component({
  selector: 'app-holaris-delete',
  templateUrl: './holaris-delete.component.html',
  styleUrls: ['./holaris-delete.component.sass']
})
export class HolarisDeleteComponent implements OnInit {

  modalForm = new FormGroup({
    'showBirthDayModal': new FormControl(''),
    'showJobAnniversaryModal': new FormControl(''),
    'showUserPictureOnToolsModal': new FormControl(''),
    'deleteHoliday': new FormControl(''),
    'deleteContact': new FormControl('')
  });
  resource: FullResourceDto;

  constructor(public activeModal: NgbActiveModal, private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.modalForm.get('showBirthDayModal').setValue(false);
    this.modalForm.get('showJobAnniversaryModal').setValue(false);
    this.modalForm.get('showUserPictureOnToolsModal').setValue(false);
    this.modalForm.get('deleteHoliday').setValue(true);
    this.modalForm.get('deleteContact').setValue(true);
  }

  /**
   * Save resource
   */
  save() {
    this.resource.birthSend = this.modalForm.get('showBirthDayModal').value;
    this.resource.showJobAnniversary = this.modalForm.get('showJobAnniversaryModal').value;
    this.resource.usePicture = this.modalForm.get('showUserPictureOnToolsModal').value;
    this.resourceService.notifyUpdateSubject({
      resource: this.resource,
      deleteHoliday: this.modalForm.get('deleteHoliday').value,
      deleteContact: this.modalForm.get('deleteContact').value
    });
  }
}
