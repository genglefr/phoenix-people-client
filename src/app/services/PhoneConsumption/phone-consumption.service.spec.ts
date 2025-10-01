import { TestBed } from '@angular/core/testing';

import { PhoneConsumptionService } from './phone-consumption.service';

describe('PhoneConsumptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhoneConsumptionService = TestBed.get(PhoneConsumptionService);
    expect(service).toBeTruthy();
  });
});
