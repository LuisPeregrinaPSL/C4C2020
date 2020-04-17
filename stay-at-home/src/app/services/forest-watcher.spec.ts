import { TestBed } from '@angular/core/testing';

import { ForestWatcherService } from './forest-watcher.service';

describe('ForestCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForestWatcherService = TestBed.get(ForestWatcherService);
    expect(service).toBeTruthy();
  });
});
