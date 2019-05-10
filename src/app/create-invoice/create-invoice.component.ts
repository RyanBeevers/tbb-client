import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { TaskService } from '../core/services/task.service';
import { Invoice } from '../core/models/invoice.model'
import { InvoiceService } from '../core/services/invoice.service';

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
    if(!this.userService.isAuthenticated() || this.user.roleType!='admin'){
      this.router.navigate(['/not-authorized']);
    }else{
      this.getAllUsers();
    }

    if(localStorage.getItem('invoice')){
      this.edit =true;
      this.invoice=JSON.parse(localStorage.getItem('invoice'));
      localStorage.removeItem('invoice')
      console.log(this.invoice)
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
    this.userService.getAllUsers().pipe(first()).subscribe((users) => {
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
    this.invoice.invoiceId = 1;
    this.invoice.invoicePaidDate = null;
    this.invoice.invoicePaidFlag = null;;
    this.invoice.invoicePayByDate = this.payByDate;
    this.invoice.invoiceTotal = this.total;
    this.invoice.user = this.invoiceCustomer

    this.invoiceService.createInvoice(this.invoice).pipe(first()).subscribe((invoice) => {
      if (invoice) {
        this.appComponent.alert('success', 'Invoice Successfully Created and Sent!')
        this.submitted=true;
        for(let i=0; i<this.completedTasks.length;i++){
          this.completedTasks[i].invoices=invoice;
          this.taskService.updateTask(this.completedTasks[i]).pipe(first()).subscribe((task) => {
          }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
          this.router.navigate(['/view-invoices']);
        }
      }else{
        this.appComponent.alert('danger', 'Invoice was not saved!')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error with server! Please try again later!') });
  }

  update(){
    parseFloat(this.discount).toFixed(2)
    this.invoice.invoiceDateOfIssue = this.dateOfIssue;
    this.invoice.invoiceDiscount = this.discount
    this.invoice.invoiceId = 1;
    this.invoice.invoicePaidDate = null;
    this.invoice.invoicePaidFlag = null;;
    this.invoice.invoicePayByDate = this.payByDate;
    this.invoice.invoiceTotal = this.total;
    this.invoice.user = this.invoiceCustomer

    this.invoiceService.updateInvoice(this.invoice).pipe(first()).subscribe((invoice) => {
      if (invoice) {
        this.appComponent.alert('success', 'Invoice Successfully Updated!')
        this.submitted=true;
        this.router.navigate(['/view-invoices']);
      }else{
        this.appComponent.alert('danger', 'Invoice was not updated!')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error with server! Please try again later!') });
  }
}
