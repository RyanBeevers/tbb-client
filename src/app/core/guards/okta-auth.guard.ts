import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaService } from './../services/okta.service';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthGuard implements CanActivate {
  oktaAuth;
  authenticated;
  constructor(private okta: OktaService, private router: Router) {
    this.authenticated = okta.isAuthenticated()
    this.oktaAuth = okta;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticated) { return true; }

    // Redirect to login flow.
    this.oktaAuth.login();
    return false;
  }
}
