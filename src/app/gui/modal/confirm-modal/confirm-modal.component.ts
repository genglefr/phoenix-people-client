import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.sass']
})
export class ConfirmModalComponent implements OnInit {

  @Input() confirmationTitle: string;
  @Input() confirmationMessage: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  /**
   * Confirm action.
   */
  confirm() {
    this.activeModal.close(true);
  }

}
