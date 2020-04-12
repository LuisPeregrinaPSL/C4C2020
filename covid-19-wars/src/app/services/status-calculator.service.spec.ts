import { TestBed } from '@angular/core/testing';

import { StatusCalculatorService } from './status-calculator.service';

describe('StatusCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusCalculatorService = TestBed.get(StatusCalculatorService);
    expect(service).toBeTruthy();
  });
});
