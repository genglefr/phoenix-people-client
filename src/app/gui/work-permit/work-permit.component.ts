import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {merge} from "rxjs";

@Component({
  selector: 'app-work-permit',
  templateUrl: './work-permit.component.html',
  styleUrls: ['./work-permit.component.sass']
})
export class WorkPermitComponent implements OnInit {

  // list of document type in work permit
  readonly workPermitDocumentTypeList: string[] = [
    'Residence permit - Carte bleue européenne',
    'Residence permit - Travailleur Salarié',
    'Residence permit - United Kingdom',
    'Autorisation de travail pour ressortissant de pays tiers',
    'Temporary protection certificate',
    'Protection Internationale - statut de réfugié',
    'Membre famille UE',
    'Résident de longue durée - UE'
  ];
  // list of document type in residence permit
  readonly residencePermitDocumentTypeList: string[] = [
    'Carte de séjour temporaire',
    'Certificat de résidence algérien',
    'Carte de séjour pluriannuelle',
    'Niederlassungserlaubnis',
    'Carte de Resident de Longue Duree - UE',
    'B. Sejour Illimite'
  ]
  @Input() today: NgbDate;
  @Input() isAdminOfCandidate: boolean;
  @Input() isCandidate: boolean = false;
  @Input() isResidencePermit: boolean = false;
  @Input() workPermitIdNotRequired: boolean = false;

  required: boolean = false;
  documentTypeList: string[];
  permitType: string;

  permitForm = new FormGroup({
    'workPermitNecessary': new FormControl(''),
    'eoPermitDate': new FormControl(''),
    'issueDate': new FormControl(''),
    'permitID': new FormControl(null),
    'documentType': new FormControl(null)
  });

  constructor() { }

  ngOnInit() {
    this.documentTypeList = this.isResidencePermit ? this.residencePermitDocumentTypeList : this.workPermitDocumentTypeList;
    this.permitType = this.isResidencePermit ? 'Residence' : 'Work';
    merge(
      this.endOfPermitDate.valueChanges,
      this.issueDate.valueChanges,
      this.permitID.valueChanges,
      this.documentType.valueChanges
    ).subscribe(() => {
      this.updateRequiredStatus();
    });
  }

  /**
   * If end of work permit date, issue date or permit ID are filled in,
   * these fields become mandatory
   */
  updateRequiredStatus() {
    this.required = this.endOfPermitDate.value || this.issueDate.value || this.permitID.value || this.documentType.value;
  }


  get workPermitNecessary() {
    return this.permitForm.get('workPermitNecessary');
  }

  get endOfPermitDate() {
    return this.permitForm.get('eoPermitDate');
  }

  get issueDate() {
    return this.permitForm.get('issueDate');
  }

  get permitID() {
    return this.permitForm.get('permitID');
  }

  get documentType() {
    return this.permitForm.get('documentType') as FormControl;
  }

}
