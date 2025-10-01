import {TestBed} from '@angular/core/testing';

import {AlarmCodeService} from './alarm-code.service';

describe('AlarmCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlarmCodeService = TestBed.get(AlarmCodeService);
    expect(service).toBeTruthy();
  });
});
