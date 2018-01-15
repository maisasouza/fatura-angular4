/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersistenciaService } from './persistencia.service';

describe('PersistenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistenciaService]
    });
  });

  it('should ...', inject([PersistenciaService], (service: PersistenciaService) => {
    expect(service).toBeTruthy();
  }));
});
