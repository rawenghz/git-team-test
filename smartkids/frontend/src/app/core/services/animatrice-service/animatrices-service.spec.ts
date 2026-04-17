import { TestBed } from '@angular/core/testing';

import { AnimatricesService } from '../animatrices-service';

describe('AnimatricesService', () => {
  let service: AnimatricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimatricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
