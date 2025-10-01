import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ResourceService} from '../../../services/Resource/resource.service';

@Component({
  selector: 'app-force-create',
  templateUrl: './force-create.component.html',
  styleUrls: ['./force-create.component.sass']
})
export class ForceCreateComponent implements OnInit {

  @Input() message: string;

  constructor(public activeModal: NgbActiveModal, private resourceService: ResourceService) {
  }

  ngOnInit() {
  }

  /**
   * Force create anyway
   */
  forceCreate() {
    this.resourceService.notifyForceCreate();
  }

}
