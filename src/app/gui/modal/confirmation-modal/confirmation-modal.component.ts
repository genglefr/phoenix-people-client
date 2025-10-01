import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PageCandidateDto} from '../../../model';
import {CandidateService} from '../../../services/Candidate/candidate.service';
import {NotificationService} from '../../../services/notification.service';
import {Router} from '@angular/router';
import {LoadingService} from '../../../services/loading.service';
import {ResourceService} from '../../../services/Resource/resource.service';
import {Subject} from 'rxjs';
import {exhaustMap} from 'rxjs/operators';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.sass']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() account: string;
  @Input() action: string;
  @Input() multiple: boolean;
  @Input() list: PageCandidateDto[];
  @Input() isEdit: boolean;

  callSubject = new Subject<() => Promise<any>>();

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private readonly candidateService: CandidateService,
              private readonly notificationService: NotificationService,
              private readonly loadingService: LoadingService,
              private readonly resourceService: ResourceService) {
  }

  ngOnInit() {
    this.callSubject.asObservable().pipe(
      exhaustMap(callback  => callback())
    ).subscribe();
  }

  /**
   * Move click event
   */
  moveClick(account, isEdit) {
    this.callSubject.next(() => this.move(account, isEdit));
  }

  /**
   * Delete click
   */
  deleteClick(account) {
    this.callSubject.next(() => this.delete(account));
  }

  /**
   * Delete click
   */
  moveSelectedClick() {
    this.callSubject.next(() => this.moveSelected());
  }

  /**
   * Move the person corresponding to the account in the resources.
   * @param account of the resources
   * @param isEdit boolean to know if the user is on the edit candidate form or on the manage candidates view
   */
  move(account, isEdit): Promise<any> {
    return this.candidateService.moveCandidate(account).then(
      () => {
        this.notificationService.addSuccessToast(`Resource ${account} successfully moved`);
        this.resourceService.addToTimesheetAndHolaris(account);
        this.router.navigate(['administration/resources/', account]);
      }).catch(() => {
        if(isEdit) {
          this.router.navigate(['administration/candidates/', account]);
        } else {
          this.router.navigate(['administration/candidates']);
        }
    }).finally(() => this.activeModal.close());
  }

  /**
   * Delete from the set of candidates the account.
   */
  delete(account) {
    return this.candidateService.deleteCandidate(account).then(
      () => {
        this.candidateService.notifyDeleteCandidate();
        this.notificationService.addSuccessToast('Candidate successfully deleted');
      }).catch((er) => {
      this.notificationService.addErrorToast(er.error.message);
      this.router.navigate(['administration/candidates']);
    }).finally(() => {
      this.loadingService.hide();
      this.activeModal.close();
      }
    );
  }

  /**
   * Move selected candidates
   */
  moveSelected() {
    const promises = [];
    this.list.map(elt => elt.account).forEach(account => {
      promises.push(this.candidateService.moveCandidate(account)
        .then(() => {
          this.notificationService.addSuccessToast(`Resource ${account} successfully moved`);
          this.resourceService.addToTimesheetAndHolaris(account);
        }));
    });
    return Promise.all(promises.map(p => p.catch(() => null))).finally(() => {
      this.candidateService.notifyDeleteCandidate();
      this.loadingService.hide();
      this.activeModal.close();
    });
  }

}
