import { Injectable } from '@angular/core';
import {NotificationService} from '../notification.service';
import {FileWithDataDto} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileType: string[] = ['xlsx', 'xls', 'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
  private excelFileType: string[] = ['xlsx'];

  constructor(private notificationService: NotificationService) { }

  /**
   * check if the type file is valid
   * @param file to check.
   */
  checkIfTypeOfAttachmentIsExcel(file): boolean {
    const extension = file.name.split('.');
    if (!this.excelFileType.includes(extension[extension.length - 1])) {
      this.notificationService.addErrorToast(`The extension of file :  ${file.name} is invalid`);
      return false;
    }
    return true;
  }

  /**
   * check if the type file is valid.
   * @param file the file.
   */
  checkIfTypeOfAttachmentIsValid(file): boolean {
    const extension = file.name.split('.');
    if (!this.fileType.includes(extension[extension.length - 1])) {
      this.notificationService.addErrorToast(`The extension of file :  ${file.name} is invalid`);
      return false;
    }
    return true;
  }


  /**
   * Convert file to FileWithDataDto
   * @param file the file.
   */
  convertToFileWithDataDto(file: File): Promise<FileWithDataDto> {
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();
      const fileByteArray = [];
      reader.onloadend = (evt) => {
        // @ts-ignore
        if (evt.target.readyState === FileReader.DONE) {
          // @ts-ignore
          const arrayBuffer: ArrayBuffer = <ArrayBuffer>(evt.target.result);
          const array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }
        }
        // @ts-ignore
        resolve({
          filename: file.name,
          data: fileByteArray
        } as FileWithDataDto);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
