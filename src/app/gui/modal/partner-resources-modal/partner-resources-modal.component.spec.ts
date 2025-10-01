import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerResourcesModalComponent } from './partner-resources-modal.component';

describe('PartnerResourcesModalComponent', () => {
  let component: PartnerResourcesModalComponent;
  let fixture: ComponentFixture<PartnerResourcesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerResourcesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerResourcesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
