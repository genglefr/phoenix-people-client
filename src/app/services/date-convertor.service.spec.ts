import {TestBed} from '@angular/core/testing';

import {DateConvertorService} from './date-convertor.service';

describe('DateConvertorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateConvertorService = TestBed.get(DateConvertorService);
    expect(service).toBeTruthy();
  });
});

