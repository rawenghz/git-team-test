import { TestBed } from '@angular/core/testing';

import { EnfantsService } from './enfant-service';

describe('EnfantsService', () => {
  let service: EnfantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnfantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
