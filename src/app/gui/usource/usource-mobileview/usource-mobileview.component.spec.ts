import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsourceMobileviewComponent } from './usource-mobileview.component';

describe('UsourceMobileviewComponent', () => {
  let component: UsourceMobileviewComponent;
  let fixture: ComponentFixture<UsourceMobileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsourceMobileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsourceMobileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
