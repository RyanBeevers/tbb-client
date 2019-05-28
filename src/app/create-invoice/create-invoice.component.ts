import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { TaskService } from '../core/services/task.service';
import { Invoice } from '../core/models/invoice.model'
import { InvoiceService } from '../core/services/invoice.service';
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  user: User = {};
  users = [];
  today = new Date();
  invoice: Invoice = { };
  dateOfIssue = (this.today.getMonth()+1)+'/'+this.today.getDate()+'/'+this.today.getFullYear();
  invoiceCustomer: User = {};
  chosenBusiness="Choose a customer..."
  completedTasks=[];
  tasks = [];
  subtotal;
  total; 
  discount; 
  submitted=false;
  edit=false;
  processing=false;
  showConfirmPaid=false;
  paid=false;

  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  payByDate = (this.nextweek.getMonth()+1)+'/'+(this.nextweek.getDate())+'/'+this.nextweek.getFullYear();

  constructor(
    private userService: UserService,
    private router: Router,
    private appComponent: AppComponent,
    private taskService: TaskService,
    private invoiceService: InvoiceService,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.user=JSON.parse(localStorage.getItem('user'))
    if(!this.userService.isAuthenticated() || !this.user.admin){
      this.router.navigate(['/not-authorized']);
    }else{
      this.getAllUsers();
    }

    if(localStorage.getItem('invoice')){
      this.edit =true;
      this.invoice=JSON.parse(localStorage.getItem('invoice'));
      localStorage.removeItem('invoice')
      this.dateOfIssue=String(this.invoice.invoiceDateOfIssue);
      this.discount=this.invoice.invoiceDiscount;
      this.discount = parseFloat(this.discount).toFixed(2)
      this.payByDate = String(this.invoice.invoicePayByDate);
      this.total = this.invoice.invoiceTotal;
      this.total = parseFloat(this.total).toFixed(2)
      this.invoiceCustomer = this.invoice.user;
      this.tasks = [];

      this.taskService.getTasksByInvoice(this.invoice).pipe(first()).subscribe((tasks) => {
        this.completedTasks.push(tasks);
        if (this.completedTasks[0].length>0) {
          this.subtotal=this.total+this.discount;
          this.subtotal = parseFloat(this.subtotal).toFixed(2);
          for(let i=0;this.completedTasks.length;i++){
            this.completedTasks[0][i].taskFinalCost = parseFloat(this.completedTasks[0][i].taskFinalCost).toFixed(2)
            this.completedTasks[0][i].taskCostPerHour = parseFloat(this.completedTasks[0][i].taskCostPerHour).toFixed(2)
          }
        }else{
          this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!')
          this.router.navigate(['/view-invoices']);
        };
      }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
    }
  }

  getAllUsers(){
    this.userService.getUsersByAdmin(this.user.myAdminPassphrase).pipe(first()).subscribe((users) => {
      if (users) {
        this.users.push(users);
      }else{
        this.appComponent.alert('warning', 'No Users Currently Available to Filter')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
  }

  getUser(i){
    this.chosenBusiness = this.users[0][i].businessName;
    this.invoiceCustomer = this.users[0][i];
    this.getTasks();
  }

  getTasks(){
    this.tasks = [];
    this.completedTasks = [];
    this.total=0;
    this.discount=0;
    this.subtotal=0;
    this.appComponent.closeAlert();
    this.taskService.getTasksByUserIdAndNoInvoice(this.invoiceCustomer).pipe(first()).subscribe((tasks) => {
    
      if(tasks[0]){
        this.tasks.push(tasks);
        if(this.tasks[0].length==1){
          //if theres only one
          if(this.tasks[0][0].taskStatus=='Completed'){
            this.completedTasks.push(this.tasks[0][0])
            this.completedTasks[0].taskFinalCost = parseFloat(this.completedTasks[0].taskFinalCost).toFixed(2);
            this.completedTasks[0].taskCostPerHour = parseFloat(this.completedTasks[0].taskCostPerHour).toFixed(2);
          }else{
            this.appComponent.alert('warning', 'No Tasks Currently Available for this Invoice')
          }
        }else{
          for(let i=0;i<this.tasks[0].length;i++){
            if(this.tasks[0][i].taskStatus =='Completed'){
              this.completedTasks.push(this.tasks[0][i])
            }
          }
          for(let i=0;i<this.completedTasks.length;i++){
            this.completedTasks[i].taskFinalCost = parseFloat(this.completedTasks[i].taskFinalCost).toFixed(2);
              this.completedTasks[i].taskCostPerHour = parseFloat(this.completedTasks[i].taskCostPerHour).toFixed(2);
          }
        }
        this.subtotal=0;
        for(let i=0;i<this.completedTasks.length;i++){
          this.subtotal+= Number(this.completedTasks[i].taskFinalCost);
        }
        this.subtotal = parseFloat(this.subtotal).toFixed(2);
        if(isNaN(this.discount)){
          this.discount=0;
        }
        this.total=0;
        this.total = Number(this.subtotal) - this.discount;
        this.total = parseFloat(this.total).toFixed(2);
      }

     else{
       this.total=0;
       this.subtotal=0;
       this.discount=0;
        this.appComponent.alert('warning', 'No Tasks Currently Available for this Invoice')
      }
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
  }

  calculate(){
    this.total = parseFloat(this.subtotal)-parseFloat(this.discount);
    this.total = this.total.toFixed(2);
  }

  save(){
    parseFloat(this.discount).toFixed(2)
    this.invoice.invoiceDateOfIssue = this.dateOfIssue;
    this.invoice.invoiceDiscount = this.discount
    this.invoice.invoicePaidDate = null;
    this.invoice.invoicePaidFlag = null;;
    this.invoice.invoicePayByDate = this.payByDate;
    this.invoice.invoiceTotal = this.total;
    this.invoice.user = this.invoiceCustomer
    this.invoice.adminId = this.user.userId;
    
    this.invoiceService.createInvoice(this.invoice).pipe(first()).subscribe((invoice) => {
      if (invoice) {
        this.appComponent.alert('success', 'Invoice Successfully Created')
        this.submitted=true;
        for(let i=0; i<this.completedTasks.length;i++){
          this.completedTasks[i].invoices=invoice;
          this.taskService.updateTask(this.completedTasks[i]).pipe(first()).subscribe((task) => {
          }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
        }
      }else{
        this.appComponent.alert('danger', 'Invoice was not saved!')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error with server! Please try again later!') });
  }

  update(){
    if(this.paid){
      this.invoice.invoicePaidFlag=true;
      let paidDate = (this.today.getMonth()+1)+'/'+this.today.getDate()+'/'+this.today.getFullYear();
      this.invoice.invoicePaidDate=paidDate;
    }else{
      this.invoice.invoicePaidDate = null;
      this.invoice.invoicePaidFlag = null;;
    }
    parseFloat(this.discount).toFixed(2)
    this.invoice.invoiceDateOfIssue = this.dateOfIssue;
    this.invoice.invoiceDiscount = this.discount
    this.invoice.invoicePayByDate = this.payByDate;
    this.invoice.invoiceTotal = this.total;
    this.invoice.user = this.invoiceCustomer

    this.invoiceService.updateInvoice(this.invoice).pipe(first()).subscribe((invoice) => {
      if (invoice) {
        this.appComponent.alert('success', 'Invoice Successfully Updated!')
        this.submitted=true;
        
      }else{
        this.appComponent.alert('danger', 'Invoice was not updated!')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error with server! Please try again later!') });
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
    this.appComponent.alert('success', 'Successfully Exported!')
    pdf.save(this.invoiceCustomer.businessName + '-TBB Invoice.pdf'); // Generated PDF
    });
    setTimeout(()=>{
      this.processing=false;
    }, 3000)
  }

  emailAndExport(){
    this.processing=true;
    this.export();
    setTimeout(()=>{
      let link = "mailto:" + this.invoiceCustomer.email + 
      '?subject=Your TBB Invoice is here!&body='
      + 'Invoice Total Due: $' + this.invoice.invoiceTotal
      + '%0D%0ADue By: ' + this.payByDate
      + '%0D%0A %0D%0A'
      +'Thank you for choosing The Busy Beevers! %0D%0A %0D%0A'
      this.processing=false;
      window.location.href=link
    }, 3000);

  }
  returnToInvoices(){
    this.router.navigate(['/view-invoices']);
  }

  confirmPaid(){
    if(!this.showConfirmPaid){
      this.showConfirmPaid=true;
    }else{
      this.showConfirmPaid=false;
    }
  }

  updatePaid(){
    this.paid=true;
    this.update();
  }
}
