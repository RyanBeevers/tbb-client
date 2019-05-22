import { TestBed, async, inject } from '@angular/core/testing';

import { OktaAuthGuard } from './okta-auth.guard';

describe('OktaAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OktaAuthGuard]
    });
  });

  it('should ...', inject([OktaAuthGuard], (guard: OktaAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
