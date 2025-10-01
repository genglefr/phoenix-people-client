import {Component, Input, OnInit} from '@angular/core';
import {JobPositionDto} from '../../model';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-job-position-select',
  templateUrl: './job-position-select.component.html',
  styleUrls: ['./job-position-select.component.sass']
})
export class JobPositionSelectComponent implements OnInit {

  @Input()
  jobPositions: JobPositionDto[];

  @Input()
  control: FormControl;

  @Input()
  required = false;

  constructor() { }

  ngOnInit() {
  }

}
