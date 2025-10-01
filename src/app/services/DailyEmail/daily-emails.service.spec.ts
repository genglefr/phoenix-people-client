import { TestBed } from '@angular/core/testing';

import { DailyEmailsService } from './daily-emails.service';

describe('DailyEmailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyEmailsService = TestBed.get(DailyEmailsService);
    expect(service).toBeTruthy();
  });
});
