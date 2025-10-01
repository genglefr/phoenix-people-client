import {TestBed} from '@angular/core/testing';

import {ReferrersService} from './referrers.service';

describe('ReferrersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferrersService = TestBed.get(ReferrersService);
    expect(service).toBeTruthy();
  });
});
