import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ForceCreateComponent} from './force-create.component';

describe('ForceCreateComponent', () => {
  let component: ForceCreateComponent;
  let fixture: ComponentFixture<ForceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForceCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
