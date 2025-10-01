import { Component, OnInit } from '@angular/core';
import {ReferredDto, ResourceFullNameAndAccountDto, ShortResourceDto} from "../../../model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ReferrersService} from "../../../services/Referrer/referrers.service";
declare const accentFold: any;

@Component({
  selector: 'app-edit-referrer-modal',
  templateUrl: './edit-referrer-modal.component.html',
  styleUrls: ['./edit-referrer-modal.component.sass']
})
export class EditReferrerModalComponent implements OnInit {

  referred: ReferredDto;
  resources: ShortResourceDto[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public referrersService: ReferrersService
  ) { }

  ngOnInit() {
  }

  /**
   * Save the referrer
   */
  save(){
    this.referrersService.saveReferrers(this.referred).then(res => this.activeModal.close(res));
  }

}
