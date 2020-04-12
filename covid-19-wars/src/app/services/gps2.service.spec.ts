import { TestBed } from '@angular/core/testing';

import { Gps2Service } from './gps2.service';

describe('Gps2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Gps2Service = TestBed.get(Gps2Service);
    expect(service).toBeTruthy();
  });
});
