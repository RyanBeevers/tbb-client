import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { InvoiceService } from './../core/services/invoice.service'
import { Invoice } from './../core/models/invoice.model'
import { TaskServiceService } from './../core/services/task-service.service'
import { Task } from './../core/models/task.model'
import { first } from 'rxjs/operators';

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
    private taskService: TaskServiceService,
    private invoiceService: InvoiceService,
  ) { }

  admin;
  invoice: Invoice = {};
  task: Task = {};
  columns=['Invoice ID', 'Submitted Date', 'Due Date', 'Status', 'Date Paid', 'Cost']
  status=[];
  invoices=[];
  users=[];
  viewingUser = 'All';

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
    this.columns=['Invoice ID', 'Submitted Date', 'Due Date', 'Status', 'Date Paid', 'Cost']
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
        console.log(this.users)
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
}
