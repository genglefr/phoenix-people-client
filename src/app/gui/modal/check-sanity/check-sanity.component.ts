import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileService} from '../../../services/File/file.service';
import * as fileSaver from 'file-saver';
import {SanityService} from '../../../services/Sanity/sanity.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-check-sanity',
  templateUrl: './check-sanity.component.html',
  styleUrls: ['./check-sanity.component.sass']
})
export class CheckSanityComponent implements OnInit {

  newAttachmentsFile: File;
  password = '';

  constructor(public activeModal: NgbActiveModal, private fileService: FileService,
              private sanityService: SanityService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  /**
   * Add file from the import button.
   * @param file to add.
   */
  addFile(file) {
    if (this.fileService.checkIfTypeOfAttachmentIsExcel(file[0])) {
      this.newAttachmentsFile = file[0];
    }
  }

  /**
   * Add file from the drop event.
   * @param $event drop event.
   */
  addDropFile($event: any) {
    this.addFile($event);
  }


  /**
   * Download a file that as been added.
   * @param file - The file to download.
   */
  downloadFileFromClient(file: File) {
    fileSaver.saveAs(file.slice(), file.name);
  }

  /**
   * Remove file from attachment.
   */
  removeFile() {
    this.newAttachmentsFile = null;
  }

  /**
   * Check the sanity file.
   */
  checkSanityFile() {
    this.sanityService.checkSanityFile(this.newAttachmentsFile, this.password)
      .then(
        () => this.notificationService.addSuccessToast('Sanity checks successfully executed')
      );
  }
}
