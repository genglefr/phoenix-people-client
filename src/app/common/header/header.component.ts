import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EditProfileComponent} from '../../gui/modal/edit-profile/edit-profile.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Input() showDetailsBtn: boolean;

  constructor(private route: ActivatedRoute, public router: Router, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  /**
   * Shows the modal window containing all the profile forms related to the current user
   */
  showModal() {
    const modalRef = this.modalService.open(EditProfileComponent, {
      windowClass: 'myDetailsModal',
      beforeDismiss: () => {
        if (!modalRef.componentInstance.contactForm.pristine || !modalRef.componentInstance.emergencyContactForm.pristine
          || !modalRef.componentInstance.personalUsagePolicyForm.pristine) {
          return window.confirm('Are you sure you want to discard your changes?');
        } else {
          return true;
        }
      }
    });
  }
}
