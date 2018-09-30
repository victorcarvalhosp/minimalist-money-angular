import { TestBed } from '@angular/core/testing';

import { UpdateSwService } from './update-sw.service';

describe('UpdateSwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateSwService = TestBed.get(UpdateSwService);
    expect(service).toBeTruthy();
  });
});
