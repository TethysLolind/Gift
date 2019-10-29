/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapService } from './Map.service';

describe('Service: Map', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService]
    });
  });

  it('should ...', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));
});
