import { Injectable } from '@angular/core';
import { Service } from './../models/service.model'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  service: Service = { };
  serviceObservable : Observable<Service[]>;
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

  getServices(): Observable<Service> {
    return this.http.get<Service>(environment.url + '/services')
    .pipe(catchError(this.handleError));
  }
  
  newService(service: Service): Observable<Service> {
    return this.http.post<Service>(environment.url + '/services/newService', service, httpOptions)
    .pipe(catchError(this.handleError));
  }
  
  updateService(service: Service): Observable<Service> {
    return this.http.post<Service>(environment.url + '/services/update', service, httpOptions)
    .pipe(catchError(this.handleError));
  }

  deleteService(service: Service): Observable<Service> {
    return this.http.put<Service>(environment.url + '/services/deleteService', service, httpOptions)
    .pipe(catchError(this.handleError));
  }
}
