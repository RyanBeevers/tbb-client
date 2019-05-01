import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { InvoiceService } from './../core/services/invoice.service'
import { Invoice } from './../core/models/invoice.model'
import { TaskServiceService } from './../core/services/task-service.service'
import { Task } from './../core/models/task.model'
import { formatDate } from '@angular/common';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.scss']
})
export class ViewInvoicesComponent implements OnInit {
  user: User = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private taskService: TaskServiceService,
    private invoiceService: InvoiceService,
  ) { }

  admin;
  invoice: Invoice = {};
  task: Task = {};
  columns=['Invoice ID', 'Submitted Date', 'Status', 'Date Paid', 'Cost']
  invoices = [];
  
  submittedDate=[];
  datePaid=[];
  status=[];

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    this.user=this.userService.getUser();
    this.admin=this.userService.isAdmin();
    if(this.admin){
      this.invoices=this.invoiceService.getAllInvoices();
    }else{
      this.invoices = this.invoiceService.getInvoiceByCustId(this.user.userId)
    }
    this.formatTable();
  }

  formatTable(){
    if(this.admin){
      this.columns.push('Customer ID')
    }
    for(let i=0;i<this.invoices.length;i++){
      let date = this.invoices[i].invoiceDateOfIssue;
      let dateOfIssue = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
      this.submittedDate.push(dateOfIssue)

      date=this.invoices[i].invoicePaidDate;
      if(date){
        dateOfIssue = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
        this.datePaid.push(dateOfIssue);
      }else{
        this.datePaid.push('')
      }

      let thisStatus = this.invoices[i].invoicePaidFlag;
      if(thisStatus){
        this.status.push('Paid');
      }else{
        this.status.push('Not Paid')
      }
    }
  }
  viewInvoice(index){  
    let invoiceId = this.invoices[index].invoiceId;
    let invoice = this.invoiceService.getInvoiceById(invoiceId);
    this.invoiceService.setInvoice(invoice);
    this.router.navigate(['/view-invoice']);
  }
}
