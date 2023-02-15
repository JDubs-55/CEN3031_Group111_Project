import { TestBed } from '@angular/core/testing';

import { DeckManagerService } from './deck-manager.service';

describe('DeckManagerService', () => {
  let service: DeckManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
