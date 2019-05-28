import { Injectable } from '@angular/core';
import { Service } from './../models/service.model'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';
import { User } from '../models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoice: Invoice={};
  user: User={};
  
  serviceinvoiceObservable : Observable<Invoice[]>;

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

  getAllInvoices(): Observable<Invoice> {
    return this.http.get<Invoice>(environment.url + '/invoices')
    .pipe(catchError(this.handleError));
  }

  getInvoicesByUser(user: User): Observable<Invoice> {
    return this.http.post<Invoice>(environment.url + '/invoices/getByUser', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getInvoicesByAdminId(adminId): Observable<Invoice> {
    return this.http.post<Invoice>(environment.url + '/invoices/getByAdminId', adminId, httpOptions)
    .pipe(catchError(this.handleError));
  }
  
  getInvoicesByInvoiceId(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(environment.url + '/invoices/getByInvoiceId', invoice, httpOptions)
    .pipe(catchError(this.handleError));
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(environment.url + '/invoices/newInvoice', invoice, httpOptions)
    .pipe(catchError(this.handleError));
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(environment.url + '/invoices/updateInvoice', invoice, httpOptions)
    .pipe(catchError(this.handleError));
  }
  
  
}
