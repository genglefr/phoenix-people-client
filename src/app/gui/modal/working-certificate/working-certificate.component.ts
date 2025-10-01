import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../services/notification.service';
import {ResourceService} from '../../../services/Resource/resource.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-working-certificate',
  templateUrl: './working-certificate.component.html',
  styleUrls: ['./working-certificate.component.sass']
})
export class WorkingCertificateComponent implements OnInit {

  @Input()
  templateList: string[];

  @Input()
  account: string;

  @Input()
  resourceId: number;

  @Input()
  historised: boolean;

  templateName: string = null;

  constructor(public activeModal: NgbActiveModal, private toaster: NotificationService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {

  }


  /**
   * Generate template of working certificate
   */
  generateTemplate() {
    this.resourceService.generateWorkingCertificateTemplate(this.templateName, this.resourceId, this.historised).then(
      fileData => {
        this.toaster.addSuccessToast('Successfully generated working certificate');
        fileSaver.saveAs(fileData, `Working_certificate_${this.account}.docx`);
        this.activeModal.close(true);
      }
    );
  }
}
