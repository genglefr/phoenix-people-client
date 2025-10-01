import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HolarisDeleteComponent} from './holaris-delete.component';

describe('HolarisDeleteComponent', () => {
  let component: HolarisDeleteComponent;
  let fixture: ComponentFixture<HolarisDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HolarisDeleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolarisDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
