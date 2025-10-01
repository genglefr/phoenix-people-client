import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ChurnDto} from '../../../model';
import {Subject} from 'rxjs';
import {StringUtils} from '../../../utils/StringUtils';

@Component({
  selector: 'app-churn-candidate',
  templateUrl: './churn-candidate.component.html',
  styleUrls: ['./churn-candidate.component.sass']
})
export class ChurnCandidateComponent implements OnChanges, OnInit {

  // list of reasons
  readonly REASONS = [
    {
      label: 'Employee Decision (Voluntary)',
      value: 'Voluntary'
    },
    {
      label: 'ARHS Decision (Involuntary)',
      value: 'Involuntary'
    }
  ];

  // list of comment voluntary propositions
  readonly commentsVoluntary: string[] = [
    'Career Break',
    'Culture & Work Environment',
    'Job Abandonment',
    'Leadership & Business Strategy',
    'Learning & Skills Development',
    'Legitimate Legal (FR)',
    'Mutual Agreement - legal',
    'Nature of work',
    'Promotion & Career Progression',
    'Relocation / moving',
    'Retirement Voluntary',
    'Return to Education',
    'Supervision & Counseling',
    'Total Rewards',
    'Travel',
    'Unprofessional Conduct',
    'Work / Life Balance',
    'Other'
  ];

  // list of comment involuntary propositions
  readonly commentsInvoluntary: string[] = [
    'Contract end',
    'Disability RSU Legal',
    'Documented Performance Issue - Resign',
    'Mutual Agreement',
    'Organizational Sizing',
    'Organizational Sizing - Resign',
    'Performance',
    'Retirement Involuntary',
    'Unprofessional Conduct',
    'Other'
  ];

  @Input()
  churn: ChurnDto;

  @Output()
  updateChurn: EventEmitter<ChurnDto> = new EventEmitter<ChurnDto>();

  // reason selected
  selectedReason: string;

  // comment written
  comment: string;
  comments: string[];

  selectedComment: string;

  /**
   * Emits updated churn
   */
  churnUpdated() {
    const lastCommentsList = this.comments;
    this.comments = this.selectedReason == 'Voluntary' ? this.commentsVoluntary : this.commentsInvoluntary;

    if(lastCommentsList && this.comments !== lastCommentsList) {
      this.comment = this.comments[0];
      this.selectedComment = this.comment;
    }
    this.churn = {
      reason: this.selectedReason,
      comment: this.comment
    };
    this.updateChurn.emit(this.churn);
  }

  /**
   * set defaults if input is null.
   */
  ngOnChanges(): void {
    this.selectedReason = this.churn == null ? null : this.churn.reason;
    this.comment = this.churn == null ? '' : this.churn.comment;
    this.churnUpdated();
  }

  ngOnInit() {
    this.comments = this.selectedReason == 'Voluntary' ? this.commentsVoluntary : this.commentsInvoluntary;
    if (this.churn.comment || this.comment) {
      const comment = this.comments.find(elt => elt === this.churn.comment);
      if (comment) {
        this.selectedComment = comment;
      } else {
        this.selectedComment = 'Other';
      }
    } else {
      this.selectedComment = '';
    }
  }

  /**
   * On reason change in select of comment propositions.
   * @param event
   */
  onReasonChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.comment = selectedValue;
    this.churnUpdated();
  }

  /**
   * On comment change
   * @param event
   */
  onCommentChange(event: Event): void {
    const commentValue = (event.target as HTMLTextAreaElement).value;
    if (!this.comments.includes(commentValue)) {
      this.selectedComment = 'Other';
    } else {
      this.selectedComment = commentValue;
    }
    this.churnUpdated();
  }

  /**
   * Checks if the str value is in the comments array.
   */
  isIncludedInComments(): boolean {
    return StringUtils.isBlank(this.selectedComment) || this.selectedComment !== 'Other';
  }
}
