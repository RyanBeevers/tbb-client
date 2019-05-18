import { Injectable } from '@angular/core';
import { Task } from '../models/task.model'
import { User } from '../models/user.model'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  task: Task = { };
  user: User = { };
  invoice: Invoice = { };

  serviceinvoiceObservable : Observable<Task[]>;

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

  getAllTasks(): Observable<Task> {
    return this.http.get<Task>(environment.url + '/tasks')
    .pipe(catchError(this.handleError));
  }

  getTasksByUserId(user: User): Observable<Task> {
    return this.http.post<Task>(environment.url + '/tasks/getTasksByUserId', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getTasksByUserIdAndNoInvoice(user: User): Observable<Task> {
    return this.http.post<Task>(environment.url + '/tasks/getTasksByUserIdAndNoInvoice', user, httpOptions)
    .pipe(catchError(this.handleError));
  }

  getTasksByInvoice(invoice: Invoice): Observable<Task> {
    return this.http.post<Task>(environment.url + '/tasks/getTasksByInvoice', invoice, httpOptions)
    .pipe(catchError(this.handleError));
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(environment.url + '/tasks/newTask', task, httpOptions)
    .pipe(catchError(this.handleError));
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.post<Task>(environment.url + '/tasks/updateTask', task, httpOptions)
    .pipe(catchError(this.handleError));
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.put<Task>(environment.url + '/tasks/deleteTask', task, httpOptions)
    .pipe(catchError(this.handleError));
  }

}
