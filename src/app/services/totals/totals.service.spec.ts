import { TestBed } from '@angular/core/testing';

import { TotalsService } from './totals.service';

describe('TotalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TotalsService = TestBed.get(TotalsService);
    expect(service).toBeTruthy();
  });
});
