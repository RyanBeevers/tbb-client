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
    issuer: 'https://dev-449097.okta.com/oauth2/default',
    
    //dev
    clientId: '0oanqa9witXkvvvcw356',
    redirectUri: 'http://localhost:4200/callback',
    
    //prod
    // clientId: '0oame6ad5F1HzVXqC356',
    // redirectUri: 'https://thebusybeevers.herokuapp.com/callback',
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
      scopes: ['openid',
       'email', 'profile']
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

  isTokenValid(){
    let token = JSON.parse(localStorage.getItem('okta-token-storage'))
    let expire = token.idToken.expiresAt;
    let now = (Date.now()/1000).toFixed(0);
    if(expire<now){
      this.timeOut();
    }else{
      let now1 = (parseInt(now)+(60*60))
      token.idToken.expiresAt = now1;
      localStorage.setItem('okta-token-storage', JSON.stringify(token));
      return true;
    }
  }

  async logout() {
    localStorage.removeItem('user')
    this.loggingOut=true;
    this.oktaAuth.tokenManager.clear();
    this.oktaAuth.signOut();
    setTimeout(()=>{
      this.loggingOut=false;
      this.router.navigate(['/logout']);
    }, 1000)
  }

  async timeOut(){
    localStorage.removeItem('user')
    this.loggingOut=true;
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
    setTimeout(()=>{
      this.loggingOut=false;
      localStorage.setItem('timeout', 'true')
      this.router.navigate(['/logout']);
    }, 1000)
  }

}
