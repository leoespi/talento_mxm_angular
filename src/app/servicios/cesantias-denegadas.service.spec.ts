import { TestBed } from '@angular/core/testing';

import { CesantiasDenegadasService } from './cesantias-denegadas.service';

describe('CesantiasDenegadasService', () => {
  let service: CesantiasDenegadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CesantiasDenegadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
