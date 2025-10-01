import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable()
export class FileUtils {

  constructor() {
  }

  /**
   * Allows to download the file.
   * @param data - blob data
   */
  static downloadFile(data: any, title: string) {
    const element = document.createElement('a');
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    element.href = URL.createObjectURL(blob);
    element.download = title;
    document.body.appendChild(element);
    element.click();
  }

  /**
   * Transform a blob to file.
   * @param blob to convert.
   * @param fileName of the future file.
   */
  public static blobToFile = (blob: Blob, fileName: string): File => {
    const b: any = blob;
    // A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    // Cast to a File() type
    return <File>blob;
  }



  /**
   * Download document
   * @param data to convert and download
   */
  public static convertByteArrayToBlob(data) {
    const blob: any = new Blob([data]);
    return of(window.URL.createObjectURL(blob));
  }
}
