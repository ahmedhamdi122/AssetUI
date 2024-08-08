import { TestBed } from '@angular/core/testing';

import { RequestModeService } from './request-mode.service';

describe('RequestModeService', () => {
  let service: RequestModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
