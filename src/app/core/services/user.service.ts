import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './../models/user.model';
import { ChallengeQuestions } from './../models/challengeQuestions.model'

import { environment } from '../../../environments/environment';

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
  constructor( private http: HttpClient ) { }

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

  getChallengeQuestions(user: User): Observable<ChallengeQuestions>{
    return this.http.post<ChallengeQuestions>(environment.url+'/challengeQuestions', user, httpOptions)
    .pipe(catchError(this.handleError));
  }
  
  setChallengeQuestions(challengeQuestions: ChallengeQuestions): Observable<ChallengeQuestions>{
    return this.http.post<ChallengeQuestions>(environment.url+'/setChallengeQuestions', challengeQuestions, httpOptions)
    .pipe(catchError(this.handleError));
  }
  
  verifyPassword(user: User): Observable<User>{
    return this.http.post<User>(environment.url + '/customer/login', user, httpOptions)
      .pipe(catchError(this.handleError));
  }



  logout(){
    localStorage.removeItem('user');
    this.user=null;
  }

  setUser(user){
    this.user=user;
  }

  getUser(){
    this.user = JSON.parse(localStorage.getItem('user'))
    return this.user;
  }

  isAuthenticated(): boolean{
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
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {
  userExists = (localStorage.getItem('user')) ? true : false;
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.userExists);
}