import { TestBed } from '@angular/core/testing';

import { FeaturesMapService } from './features-map.service';

describe('FeaturesMapService', () => {
  let service: FeaturesMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturesMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
