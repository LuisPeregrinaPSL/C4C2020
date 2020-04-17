import { TestBed } from '@angular/core/testing';

import { TreeCalculatorService } from './tree-calculator.service';

describe('TreeCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreeCalculatorService = TestBed.get(TreeCalculatorService);
    expect(service).toBeTruthy();
  });
});
