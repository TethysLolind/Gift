/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignlarService } from './signlar.service';

describe('Service: Signlar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignlarService]
    });
  });

  it('should ...', inject([SignlarService], (service: SignlarService) => {
    expect(service).toBeTruthy();
  }));
});
