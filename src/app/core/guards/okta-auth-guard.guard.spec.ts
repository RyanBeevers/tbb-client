import { TestBed, async, inject } from '@angular/core/testing';

import { OktaAuthGuardGuard } from './okta-auth-guard.guard';

describe('OktaAuthGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OktaAuthGuardGuard]
    });
  });

  it('should ...', inject([OktaAuthGuardGuard], (guard: OktaAuthGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
