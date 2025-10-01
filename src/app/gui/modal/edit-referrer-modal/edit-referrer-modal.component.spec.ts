import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReferrerModalComponent } from './edit-referrer-modal.component';

describe('EditReferrerModalComponent', () => {
  let component: EditReferrerModalComponent;
  let fixture: ComponentFixture<EditReferrerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReferrerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReferrerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
