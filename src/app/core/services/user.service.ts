import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { User } from './../models/user.model';
import { ChallengeQuestions } from './../models/challengeQuestions.model'

import { environment } from '../../../environments/environment';

import { OktaService } from './okta.service'
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = { };
  challengeQuestions: ChallengeQuestions = { };
  userObservable : Observable<User[]>;
  constructor( 
    private http: HttpClient, 
    private oktaService: OktaService, 
    private router: Router,
  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Aw, Snap!\n' + error.error.message);
    }
    if(error.status===403){
      console.log('error 403')
    }
    else {
      console.error(
        `Error code ${error.status}:
        ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }

  getAllUsers(): Observable<User>{
    return this.http.get<User>(environment.url + '/customer')
    .pipe(catchError(this.handleError));
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(environment.url + '/customer/login', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(environment.url + '/customer/register', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  updateUser(user: User): Observable<User> {
    return this.http.post<User>(environment.url + '/customer/update', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getEmail(user: User): Observable<User>{
    return this.http.post<User>(environment.url+'/customer/checkEmail', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getUserByEmail(user: User): Observable<User>{
    return this.http.post<User>(environment.url+'/customer/getUserByEmail', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getAdminPassphrases(){
    return this.http.get<User>(environment.url + '/customer/getAdmins')
    .pipe(catchError(this.handleError));
  }
  verifyAdminPassphrase(passphrase){
    return this.http.post<String>(environment.url+'/customer/verifyAdmin', passphrase, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getUsersByAdmin(passphrase){
    return this.http.post<String>(environment.url+'/customer/getMyUsers', passphrase, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getMyAdmin(passphrase){
    if(passphrase){
      return this.http.post<User>(environment.url+'/customer/getMyAdmin', passphrase, httpOptions)
      .pipe(catchError(this.handleError));
    }
  }

  logout(){
    localStorage.removeItem('user');
    this.user=null;
  }

  // setUser(user){
  //   this.user=user;
  // }

  // getUser(){
  //   this.user = JSON.parse(localStorage.getItem('user'))
  //   return this.user;
  // }

  isAuthenticated(): boolean{
    if(localStorage.getItem('okta-token-storage')){
      let token=JSON.parse(localStorage.getItem('okta-token-storage'));
      let currentTimestamp = Date.now();
      if(token.accessToken){
        let loggedInTimestamp = token.accessToken.expiresAt;
        if(currentTimestamp<loggedInTimestamp){
          localStorage.clear;
          this.router.navigate(['session-expired']);
          return false;
        }
      }
    }
    if (localStorage.getItem('user')){
      return true;
    }
    else{
      return false;
    }
  }

  getFirstName(){
    if (localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
      return this.user.firstName;
    }
  }

  getLastName(){
    if (localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
      return this.user.lastName;
    }
  }

  isAdmin(){
    if (localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user'))
      if(this.user.roleType == 'admin'){
        return true;
      }else{
        return false;
      }
    }
  }

  getAdmin(){
    let adminId;
    if(localStorage.getItem('myAdmin')){
      adminId=localStorage.getItem('myAdmin');
      adminId = adminId.replace(/['"]+/g, '')
      return adminId;
    }else{
      return this.user.userId;
    }
  }

  getTokenUser(){
    let newUser;
    if(localStorage.getItem('okta-token-storage')){
      let token = JSON.parse(localStorage.getItem('okta-token-storage'))
      if(token.idToken){
        newUser = token.idToken.claims.user;
      }
    }

    let dbUser: User={};
    if(newUser){
      dbUser.email=newUser.email;
      if(!localStorage.getItem('user')){
        this.getUserByEmail(dbUser).pipe(first()).subscribe((user) =>{
          if(user){
            this.user = user;
            localStorage.setItem('user', JSON.stringify(this.user));
            if(this.user.adminPassphrase && !this.user.admin){
              this.getMyAdmin(this.user.adminPassphrase).pipe(first()).subscribe((admin) =>{
                if(admin){
                  let adminDetails;
                  console.log(admin)
                  adminDetails.userId = admin.userId;
                  adminDetails.businessName = admin.businessName;
                  adminDetails.email = admin.email;
                  adminDetails.facebook = admin.facebook;
                  adminDetails.twitter = admin.twitter;
                  adminDetails.youtube = admin.youtube;
                  adminDetails.instagram = admin.instagram;
                  adminDetails.myWebsite = admin.myWebsite;
                  adminDetails.linkedIn = admin.linkedIn;
                  localStorage.setItem('myAdmin', JSON.stringify(adminDetails));
                  
                }
              })
            }
            
          }else{
            this.prepRegister(newUser);
          }
        }, (error) => {});
      }else{
        if(this.user.adminPassphrase && !this.user.admin){
          this.getMyAdmin(this.user.adminPassphrase).pipe(first()).subscribe((admin) =>{
            if(admin){
              let adminDetails: User ={};
              adminDetails.userId = admin.userId;
              adminDetails.businessName = admin.businessName;
              adminDetails.email = admin.email;
              adminDetails.facebook = admin.facebook;
              adminDetails.twitter = admin.twitter;
              adminDetails.youtube = admin.youtube;
              adminDetails.instagram = admin.instagram;
              adminDetails.myWebsite = admin.myWebsite;
              adminDetails.linkedIn = admin.linkedIn;
              localStorage.setItem('myAdmin', JSON.stringify(adminDetails));
              
            }
          })
        }
      }
    }
  }

  prepRegister(newUser){
    console.log(newUser)
    this.user.firstName = newUser.firstName;
    this.user.lastName = newUser.lastName;
    this.user.email = newUser.email;
    this.user.businessCity = newUser.city;
    this.user.businessCountry = newUser.countryCode;
    this.user.workPhone = newUser.primaryPhone;
    this.user.businessState = newUser.state;
    this.user.businessStreetAddress = newUser.streetAddress;
    this.user.businessZip = newUser.zipCode
    this.user.businessName = newUser.organization;
    this.user.userId = newUser.id;
    localStorage.setItem('preppedUser', JSON.stringify(this.user))
}
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {
  userExists = (localStorage.getItem('user')) ? true : false;
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.userExists);
}