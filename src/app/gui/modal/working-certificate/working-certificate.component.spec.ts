import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingCertificateComponent } from './working-certificate.component';

describe('WorkingCertificateComponent', () => {
  let component: WorkingCertificateComponent;
  let fixture: ComponentFixture<WorkingCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
