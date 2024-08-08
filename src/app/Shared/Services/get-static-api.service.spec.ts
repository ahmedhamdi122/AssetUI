import { TestBed } from '@angular/core/testing';

import { GetStaticApiService } from './get-static-api.service';

describe('GetStaticApiService', () => {
  let service: GetStaticApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStaticApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
