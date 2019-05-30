import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as OktaAuth from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class OktaService {
  loggingOut=false;
  
  oktaAuth = new OktaAuth({
    url: 'https://dev-449097.okta.com',
    clientId: '0oame6ad5F1HzVXqC356',
    issuer: 'https://dev-449097.okta.com/oauth2/default',
    redirectUri: 'https://thebusybeevers.herokuapp.com/callback',
  });

  constructor(
    private router: Router,
     ) {}

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }

  login() {
    // Launches the login redirect.
    this.oktaAuth.token.getWithRedirect({
      responseType: ['id_token', 'token'],
      scopes: ['openid', 'email', 'profile']
    });
  }

  async handleAuthentication() {
    const tokens = await this.oktaAuth.token.parseFromUrl();
    tokens.forEach(token => {
      if (token.idToken) {
        this.oktaAuth.tokenManager.add('idToken', token);
      }
      if (token.accessToken) {
        this.oktaAuth.tokenManager.add('accessToken', token);
      }
    });
  }

  async logout() {
    localStorage.removeItem('user')
    this.loggingOut=true;
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
    setTimeout(()=>{
      this.router.navigate(['/logout']);
    }, 1000)
  }


}
