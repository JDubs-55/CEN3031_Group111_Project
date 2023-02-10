import { TestBed } from '@angular/core/testing';

import { ProgramStateService } from './program-state.service';

describe('ProgramStateService', () => {
  let service: ProgramStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
