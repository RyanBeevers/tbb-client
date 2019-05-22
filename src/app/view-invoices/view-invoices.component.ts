import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { InvoiceService } from './../core/services/invoice.service'
import { Invoice } from './../core/models/invoice.model'
import { TaskService } from '../core/services/task.service'
import { Task } from './../core/models/task.model'
import { first } from 'rxjs/operators';
import { timeout } from 'q';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.scss']
})
export class ViewInvoicesComponent implements OnInit {
  user: User = {};
  appComponent: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private taskService: TaskService,
    private invoiceService: InvoiceService,
  ) { }

  admin;
  invoice: Invoice = {};
  task: Task = {};
  columns=['Invoice ID', 'Submitted Date', 'Due Date', 'Status', 'Date Paid', 'Total']
  status=[];
  invoices=[];
  users=[];
  viewingUser = 'All';
  processing=false;

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    this.user=JSON.parse(localStorage.getItem('user'));

    if(this.user.roleType=='admin'){
      this.loadManagerInvoices();
      this.getAllUsers();
    }else{
      this.loadUserInvoices(this.user);
    }
  }

  loadManagerInvoices(){
    this.viewingUser='All'
    this.invoices = [];
    this.invoiceService.getAllInvoices().pipe(first()).subscribe((invoices) => {
      if (invoices) {
        this.invoices.push(invoices);
        this.formatTable();
      }else{
        this.appComponent.alert('warning', 'No Invoices Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving invoices! Please try again later!') });
  }

  loadUserInvoices(user){
    this.invoices = [];
    this.invoiceService.getInvoicesByUser(user).pipe(first()).subscribe((invoices) => {
      if (invoices) {
        this.invoices.push(invoices);
        this.formatTable();
      }else{
        this.appComponent.alert('warning', 'No Invoices Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving invoices! Please try again later!') });
  }

  formatTable(){
    this.status=[];
    this.columns=['Invoice ID', 'Submitted Date', 'Due Date', 'Status', 'Date Paid', 'Total']
    if(this.user.roleType=='admin'){
      this.columns.push('Business')
      this.columns.push('Customer Name')
    }
    for(let i=0;i<this.invoices[0].length;i++){
      let thisStatus = this.invoices[0][i].invoicePaidFlag;
      if(thisStatus){
        this.status.push('Paid');
      }else{
        this.status.push('Not Paid')
      }
    }
  }

  viewInvoice(i){
    localStorage.setItem('invoice', JSON.stringify(this.invoices[0][i]))
    if(this.user.roleType=='admin' && !this.invoices[0][i].invoicePaidFlag){
      this.router.navigate(['/create-invoices']);
    }
    else if(this.user.roleType=='admin' && this.invoices[0][i].invoicePaidFlag){
      this.router.navigate(['/view-invoice']);
    }
    else{
      this.router.navigate(['/view-invoice']);
    }
  }
  getAllUsers(){
    this.invoices = [];
    this.userService.getAllUsers().pipe(first()).subscribe((users) => {
      if (users) {
        this.users.push(users);
      }else{
        this.appComponent.alert('warning', 'No Users Currently Available for filter')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
  }

  getUser(i){
    let invoiceUser: User = {};
    invoiceUser = this.users[0][i];
    this.loadUserInvoices(invoiceUser);
    this.viewingUser = invoiceUser.businessName;
  }

  getNotPaid(){
    this.processing=true;
    if(this.user.roleType=='admin'){
      this.loadManagerInvoices()
    }else{
      this.loadUserInvoices(this.user);
    }
    setTimeout(() => {
      for(let i=0;i<this.invoices[0].length;i++){
        if(this.invoices[0][i].invoicePaidFlag){
          this.status.splice(i, 1);
          this.invoices[0].splice(i, 1)
          i--;
        }
      }
      this.processing=false;
    }, 500)


  }

  getPaid(){
    this.processing=true;
    if(this.user.roleType=='admin'){
      this.loadManagerInvoices()
    }else{
      this.loadUserInvoices(this.user);
    }
    setTimeout(() => {
      for(let i=0;i<this.invoices[0].length;i++){
        if(!this.invoices[0][i].invoicePaidFlag){
          this.status.splice(i, 1);
          this.invoices[0].splice(i, 1)
          i--;
        }
      }
      this.processing=false;
    }, 500)
  }

  getAll(){
    this.processing=true;
    if(this.user.roleType=='admin'){
      this.loadManagerInvoices()
    }else{
      this.loadUserInvoices(this.user);
    }
    setTimeout(() => {
      this.processing=false;
    }, 500)
  }

  getPastDue(){
    this.processing=true;
    if(this.user.roleType=='admin'){
      this.loadManagerInvoices()
    }else{
      this.loadUserInvoices(this.user);
    }
    setTimeout(() => {
      for(let i=0;i<this.invoices[0].length;i++){
        if(this.invoices[0][i].invoicePaidFlag){
          this.status.splice(i, 1);
          this.invoices[0].splice(i, 1)
          i--;
        }
      };
    }, 500)
    setTimeout(() => {
      for(let i=0;i<this.invoices[0].length;i++){
        if(!this.checkDate(this.invoices[0][i].invoicePayByDate)){
          this.invoices[0].splice(i, 1);
          i--
        }
      };
      this.processing=false;
    }, 500)


  }

  checkDate(compareDate){
    let today = new Date();
    let month;
    let day;
    if ((today.getMonth()+1)<10){
      month = '0' + (today.getMonth()+1);
    }else{
      let month = today.getMonth()+1
    }
    if (today.getDate()<10){
      day = '0' + (today.getDate()+1);
    }else{
      day = today.getDate();
    }
    let todaysDate = month+'/'+day+'/'+today.getFullYear();

    if(todaysDate){
      let dateArr1 = todaysDate.split('/');
      let dateArr2 = compareDate.split('/');

      if(dateArr1[2]>dateArr2[2] || dateArr1[0]>dateArr2[0] || dateArr1[1]>dateArr2[1]){
        console.log('past due')
        return true;
      }else{
        console.log('not past due')

        return false;
      }
    }
  }

}
