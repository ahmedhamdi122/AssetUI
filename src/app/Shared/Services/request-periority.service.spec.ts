import { TestBed } from '@angular/core/testing';

import { RequestPeriorityService } from './request-periority.service';

describe('RequestPeriorityService', () => {
  let service: RequestPeriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestPeriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
