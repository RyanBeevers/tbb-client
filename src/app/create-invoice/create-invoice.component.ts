import { Component, OnInit } from '@angular/core';
import { User } from './../core/models/user.model';
import { UserService } from './../core/services/user.service';
import { Router } from '@angular/router';
import { CustomerService } from './../core/services/customer.service'
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  user: User = {};
  users = [];
  today = new Date();
  dateOfIssue = (this.today.getMonth()+1)+'/'+this.today.getDate()+'/'+this.today.getFullYear();
  invoiceCustomer: User = {};
  chosenBusiness="Choose a customer."

  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  payByDate = (this.nextweek.getMonth()+1)+'/'+(this.nextweek.getDate())+'/'+this.nextweek.getFullYear();

  constructor(
    private userService: UserService,
    private router: Router,
    private customerService: CustomerService,
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.user=JSON.parse(localStorage.getItem('user'))
    if(!this.userService.isAuthenticated() || this.user.roleType!='admin'){
      this.router.navigate(['/not-authorized']);
    }else{
      this.getAllUsers();
    }
  }

  getAllUsers(){
    this.userService.getAllUsers().pipe(first()).subscribe((users) => {
      if (users) {
        this.users.push(users);
      }else{
        this.appComponent.alert('warning', 'No Users Currently Available for filter')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
  }

  getUser(i){
    this.chosenBusiness = this.users[0][i].businessName;
    this.invoiceCustomer = this.users[0][i];
  }
}
