import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FileConsumptionImportDto,
  FileConsumptionImportFilterDto,
  PageDto,
} from '../../../model';
import { PhoneConsumptionService } from '../../../services/PhoneConsumption/phone-consumption.service';
import { FileConsumptionImportService } from '../../../services/FileConsumptionImport/file-consumption-import.service';
import { FilterService } from '../../../services/Filter/filter.service';
import { Pagination } from '../../../../environments/config';
import { Moment } from 'moment';
import * as moment from 'moment';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-import-tab',
  templateUrl: './file-import-tab.component.html',
  styleUrls: ['./file-import-tab.component.sass']
})
export class FileImportTabComponent implements OnInit {

  @ViewChild('attachmentInput')
  fileInput: ElementRef;

  uploadForm: FormGroup;
  fileConsumptionFilter: FileConsumptionImportFilterDto = this.filterService.getFileConsumptionFilterDto();
  pagination: Pagination;

  listFiles: PageDto<FileConsumptionImportDto>;

  acceptedExtensions: String[] = [".csv", ".xlsx", ".xls"];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private phoneConsumptionService: PhoneConsumptionService,
              private fileConsumptionImportService: FileConsumptionImportService,
              private filterService: FilterService,
              private notificationService: NotificationService)
  { }

  ngOnInit() {
    const data = this.route.snapshot.data.data;
    this.pagination = new Pagination();
    this.listFiles = data[8];
    this.uploadForm = this.formBuilder.group({
      file: [[]]
    });
  }


  /**
   * Called every time one or multiple files are selected.
   * @param event the file change.
   */
  onFileSelect(event) {
    const files = event.target.files;
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.size > 25000000)) {
      this.notificationService.addErrorToast(`File ${selectedFile.name} size cannot exceed 25 MB. Please select a smaller file.`);
    } else if(!this.checkFileNameExtension(selectedFile.name)) {
      this.notificationService.addErrorToast(`File ${selectedFile.name} is not in the correct format (should be a .xlsx, .xls or .csv file).`);
    } else {
      this.addFiles(files);
    }
  }

  /**
   * Handle file drop
   * @param $event list of file dropped in the zone
   */
  onFileDrop($event: File[]) {
    this.addFiles($event);
  }

  /**
   * Remove selected file from the list
   * @param $event the file to remove from the list
   */
  removeFile($event: File) {
    const files = this.file.value as File[];
    const index = files.indexOf($event);
    files.splice(index, 1);
    this.file.setValue(files);
  }

  /**
   * Add new files to the list, and filter potential duplicates
   * @param files the list of new files
   */
  addFiles(files: any) {
    const oldFiles = this.file.value;
    let newFiles = [];
    for (const file of files) {
      newFiles.push(file);
    }
    newFiles = newFiles.concat(oldFiles);
    newFiles.filter((file, index) => newFiles.findIndex(f => f.name === file.name) === index);
    this.file.setValue(newFiles);
  }

  get file() {
    return this.uploadForm.get('file');
  }

  /**
   * Upload file
   */
  upload() {
    this.phoneConsumptionService.uploadFiles(this.uploadForm.get('file').value)
      .subscribe(fuel => {
        this.refreshPage();
      });
    this.fileInput.nativeElement.value = "";
    this.file.setValue([]);
  }

  /**
   * Change column to sort
   * @param event column
   */
  changeSort(event) {
    if (this.fileConsumptionFilter.sortingRow === event) {
      this.fileConsumptionFilter.ascending = !this.fileConsumptionFilter.ascending;
    } else {
      this.fileConsumptionFilter.sortingRow = event;
      this.fileConsumptionFilter.ascending = true;
    }
    this.resetAndFetchPage();
  }

  /**
   * Resets the page index and refilter the page.
   */
  resetAndFetchPage() {
    this.pagination.index = 0;
    this.fetchPage();
  }

  /**
   * Fetch the page of files consumption.
   */
  fetchPage() {
    this.fileConsumptionImportService.getFilteredCandidates(this.fileConsumptionFilter, this.pagination.size, this.pagination.index)
      .then(data => this.listFiles = data);
  }

  /**
   * Refresh the page of files consumption.
   */
  refreshPage() {
    this.pagination.index = 0;
    this.fileConsumptionImportService.getFilteredCandidates(
      this.filterService.getDefaultFileConsumptionFilterDto(),
      this.pagination.size,
      this.pagination.index)
      .then(data => this.listFiles = data);
  }

  /**
   * Search with filter applied
   */
  searchWithFilter() {
    this.resetAndFetchPage();
  }

  /**
   * Change pagination
   * @param pagination contains page index and size
   */
  changePagination(pagination: Pagination) {
    this.pagination = pagination;
    this.fetchPage();
  }

  /**
   * Reformat a date variable to the desired format
   * @param date Date to reformat
   */
  formatDate(date:Moment){
    if (date != undefined){
      return moment(date).format("DD/MM/YY HH:mm");
    }
    return "";
  }

  /**
   * Remove the extension from a file name if there's one
   * @param fileName name of the file
   */
  getFileNameWithoutExtension(fileName: string): string {
    if (fileName.includes('.')) {
      return fileName.substring(0, fileName.lastIndexOf('.'));
    } else {
      return fileName;
    }
  }

  /**
   * Get the extension of the file name
   * @param fileName name of the file
   */
  getFileNameExtension(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.'), fileName.length);
  }

  /**
   * Check if a file is in the correct extension
   * @param fileName name of the file
   */
  checkFileNameExtension(fileName: string): boolean {
    return this.acceptedExtensions.includes(this.getFileNameExtension(fileName));
  }

}

