import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {LightResourceDto, PageDto} from '../../model';

declare const accentFold: any;

@Component({
  selector: 'app-usource',
  templateUrl: './usource.component.html',
  styleUrls: ['./usource.component.sass']
})
export class USourceComponent implements OnInit {

  resources: PageDto<LightResourceDto>;

  constructor(private route: ActivatedRoute, private router: Router,
              private notificationService: NotificationService) { }

  ngOnInit() {
    const data = this.route.snapshot.data.data;
  }

}
