import { TestBed } from '@angular/core/testing';

import { PartnerService } from './partner.service';

describe('PartnerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartnerService = TestBed.get(PartnerService);
    expect(service).toBeTruthy();
  });
});
