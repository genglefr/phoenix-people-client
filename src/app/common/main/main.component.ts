import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/User/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getAuthenticatedUser();
  }
}
