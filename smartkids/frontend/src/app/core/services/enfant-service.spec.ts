import { TestBed } from '@angular/core/testing';

<<<<<<< HEAD
import { EnfantsService } from './enfant-service';

describe('EnfantsService', () => {
  let service: EnfantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnfantsService);
=======
import { User } from './user';

describe('User', () => {
  let service: User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(User);
>>>>>>> f5aea04e40189a5a821390d1c54c7d8f62b359af
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
