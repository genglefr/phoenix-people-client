import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFixedCostComponent } from './edit-fixed-cost.component';

describe('EditFixedCostComponent', () => {
  let component: EditFixedCostComponent;
  let fixture: ComponentFixture<EditFixedCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFixedCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFixedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
