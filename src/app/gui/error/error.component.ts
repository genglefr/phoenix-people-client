import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent implements OnInit {

  error: HttpErrorResponse = null;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.error = this.route.snapshot.data['error'];
    if (isNullOrUndefined(this.error)) {
      this.setNoError();
    }
  }

  setNoError() {
    this.error = new HttpErrorResponse({
      error: new Error('Sorry but the page you were trying to view does not exist.'),
      status: 404,
      statusText: '404 : Page Not Found'
    });
  }
}
