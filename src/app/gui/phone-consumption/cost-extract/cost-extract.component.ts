import {Component, Input, OnInit} from '@angular/core';
import {CompanyDto} from '../../../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '../../../services/notification.service';
import {ExportResourcesService} from '../../../services/ExportResources/export-resources.service';

@Component({
  selector: 'app-cost-extract',
  templateUrl: './cost-extract.component.html',
  styleUrls: ['./cost-extract.component.sass']
})
export class CostExtractComponent implements OnInit {

  @Input()
  companyList: CompanyDto[];

  companySelected: string[];
  constructor(private activeModal: NgbActiveModal,
              private notificationService: NotificationService,
              private exportService: ExportResourcesService) { }

  ngOnInit() {
  }


  /**
   * Closes the modal.
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * Change the entity.
   */
  changeEntity(companyList) {
    this.companySelected = companyList;
  }

  /**
   * Export resource table as an excel
   */
  export() {
    this.exportService.exportPhoneConsumption(this.companySelected).then(() => {
      this.notificationService.addSuccessToast('Export file successfully created');
      this.activeModal.close();
    });
  }

}
