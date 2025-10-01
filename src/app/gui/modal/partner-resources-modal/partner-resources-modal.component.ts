import {Component, Input, OnInit} from '@angular/core';
import {LightResourceDto, LightResourceInfoDto} from '../../../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-partner-resources-modal',
  templateUrl: './partner-resources-modal.component.html',
  styleUrls: ['./partner-resources-modal.component.sass']
})
export class PartnerResourcesModalComponent implements OnInit {

  @Input()
  resources: LightResourceInfoDto[];

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  /**
   * Closes the modal window.
   */
  closeModal() {
    this.activeModal.close();
  }
}
