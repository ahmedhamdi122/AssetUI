import { TestBed } from '@angular/core/testing';

import { SubProblemService } from './sub-problem.service';

describe('SubProblemService', () => {
  let service: SubProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
