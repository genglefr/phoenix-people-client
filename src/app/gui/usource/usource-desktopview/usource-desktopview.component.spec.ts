import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsourceDesktopviewComponent } from './usource-desktopview.component';

describe('UsourceDesktopviewComponent', () => {
  let component: UsourceDesktopviewComponent;
  let fixture: ComponentFixture<UsourceDesktopviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsourceDesktopviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsourceDesktopviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
