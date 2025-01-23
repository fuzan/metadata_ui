import { TestBed } from '@angular/core/testing';

import { TppService } from './tpp.service';

describe('TppService', () => {
  let service: TppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
