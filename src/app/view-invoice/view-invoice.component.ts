import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { InvoiceService } from './../core/services/invoice.service'
import { Invoice } from './../core/models/invoice.model'
import { AppComponent } from '../app.component';
import { TaskService } from '../core/services/task.service';
import { first } from 'rxjs/operators';
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  user: User = {};
  invoice: Invoice = {};
  customer: User={};
  completedTasks=[];
  tasks = [];
  subtotal;
  total; 
  discount; 
  submitted=false;
  edit=false;
  invoiceCustomer: User = {};
  processing=false;

  constructor(
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,
    private taskService: TaskService,
    private invoiceService: InvoiceService,
  ) { }
  
  today = new Date();
  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  payByDate = (this.nextweek.getMonth()+1)+'/'+(this.nextweek.getDate())+'/'+this.nextweek.getFullYear();
  
  task = {}
  paid=false;

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }else{
      this.user=JSON.parse(localStorage.getItem('user')) 
    }
    if(localStorage.getItem('invoice')){
      this.invoice=JSON.parse(localStorage.getItem('invoice'))
      localStorage.removeItem('invoice');
      this.customer=this.invoice.user;
      this.paid=this.invoice.invoicePaidFlag;
      this.getTasks();
    }else{
      this.router.navigate(['/view-invoices']);
    }
  }

  pay(){

  }

  getTasks(){
    this.tasks = [];
    this.completedTasks = [];
    this.total=0;
    this.discount=0;
    this.subtotal=0;
    this.appComponent.closeAlert();
    this.taskService.getTasksByInvoice(this.invoice).pipe(first()).subscribe((tasks) => {
      if(tasks){
        this.tasks.push(tasks)
      }else{
        this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!')
      }

    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
  }

  export(){
    this.processing=true;
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 200;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

    pdf.save(this.invoice.user.businessName + '-TBB Invoice Id#' + this.invoice.invoiceId + '.pdf'); // Generated PDF
    });
    setTimeout(()=>{
      this.processing=false;
      this.appComponent.alert('success', 'Successfully Exported!')
    }, 3000)
  }

  emailAndExport(){
    this.processing=true;
    this.export();
    setTimeout(()=>{
      let link = "mailto:" + this.invoice.user.email + 
      '?subject=Your TBB Invoice is here!&body=Invoice Id: ' + this.invoice.invoiceId
      + '%0D%0AInvoice Total Due: $' + this.invoice.invoiceTotal.toFixed(2)
      + '%0D%0ADue By: ' + this.invoice.invoicePayByDate
      + '%0D%0A %0D%0A'
      +'Thank you for choosing The Busy Beevers! %0D%0A %0D%0A'
      this.processing=false;
      window.location.href=link
    }, 3000);

  }
}
