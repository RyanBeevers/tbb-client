import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { Router } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { User } from '../core/models/user.model';
import { Task } from '../core/models/task.model';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../core/services/service.service';
import { first } from 'rxjs/operators';
import { Service } from '../core/models/service.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  user: User = { };
  newUser: User = { }
  task: Task = { };
  services = [];
  custom=false;
  selectedService: Service = { };
  edit=false;
  taskCostPerHour;
  actualCost;
  estimatedCost;
  taskTitle='';
  taskEstimatedEffort;
  admin=false;
  taskActualEffort;
  confirmDelete=false;
  completed=false;
  viewingUser = "Please select a user...";
  users = [];
  taskUser: User = {};
  dateError=false;
  tomorrow;
  selectedServiceLabel = 'Select a Service'
  noSelectedService=false;
  adminId;
  showConfirmPaid = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private taskService: TaskService,
    private appComponent: AppComponent,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
  ) { }


  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user.admin){
      this.admin=true;
    }
    
    this.loadServices();
    
    if(this.user.admin){
      this.getAllUsers();
      this.adminId = this.user.userId;
    }else{
      let adminUser = JSON.parse(localStorage.getItem('myAdmin'))
      this.adminId = adminUser.userId;
    }

    if(localStorage.getItem('selectedTask')){
      this.task=JSON.parse(localStorage.getItem('selectedTask'));
      localStorage.removeItem('selectedTask');
      this.viewingUser = this.task.user.businessName;
      this.taskUser = this.task.user;

      this.taskTitle = this.task.taskName;
      if(this.task.taskStatus =='Completed'){
        this.completed=true;
      }
      this.taskCostPerHour = this.task.taskCostPerHour;
      this.taskActualEffort = this.task.taskActualEffort;
      this.edit = true;
      this.taskEstimatedEffort = this.task.taskEstimatedEffort;
      if(this.task.taskFinalCost){
        this.actualCost = this.task.taskFinalCost
      }
      this.calculateTotal();
    }else{
      this.task.taskStatus='Not Yet Started'
    }

    this.registerForm = this.formBuilder.group({
      taskEstimatedEffort: ['', Validators.required],
      taskDesc: ['', Validators.required],
      taskDueDate: ['', Validators.required],
      taskActualEffort: [''],
    })
  }

  get f() { return this.registerForm.controls; }

  getTomorrow(){
    let today = new Date();
    let month;
    let day;
    if ((today.getMonth()+1)<10){
      month = '0' + (today.getMonth()+1);
    }else{
      let month = today.getMonth()+1
    }
    if (today.getDate()+1<10){
      day = '0' + (today.getDate()+1);
    }else{
      day = today.getDate()+1;
    }
    this.tomorrow = today.getFullYear()+'-'+month+'-'+day;

    if(this.task.taskDueDate){
      let dateArr1 = this.task.taskDueDate.split('-');
      let dateArr2 = this.tomorrow.split('-');
      if(dateArr1[0]<dateArr2[0] || dateArr1[1]<dateArr2[1]){
        this.dateError=true;
        return false;
      }else if(dateArr1[1]<=dateArr2[1] && dateArr1[2]<dateArr2[2]){
        this.dateError=true;
        return false;
      }
      
      else{
        this.dateError=false;
        return true;
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if(!this.task.taskName){
      if(this.selectedServiceLabel == 'Select a Service'){
        this.noSelectedService=true;
        this.appComponent.alert('warning', 'Please choose a service!');
        return;
      }
    }
    this.noSelectedService=false;
    if(!this.getTomorrow()){
      this.appComponent.alert('warning', 'Please choose a date past today!');
      return;
    }

    if (this.registerForm.invalid) {
      this.appComponent.alert('warning', 'Please fill in all required fields!');
      return;
    }

    if(this.user.admin){
      if(!this.taskUser.userId){
        this.appComponent.alert('warning', 'Please select a user!');
        return;
      }
    }
    if(!this.edit){
      this.submitNewTask();
    }else{
      this.updateTask();
    }
  }

  loadServices(){
    this.services = [];
    let adminId;
    if(!this.user.admin){
      let admin=JSON.parse(localStorage.getItem('myAdmin'))
      adminId = admin.userId
    }else{
      adminId = this.user.userId;
    }
    this.serviceService.getServices(adminId).pipe(first()).subscribe((services) => {
      if (services) {
        this.services.push(services)
      }else{
        this.appComponent.alert('warning', 'No Services Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error is retrieving services! Please try again later') });
  }
  
  customService(){
    this.selectedServiceLabel='Custom Service'
    this.selectedService = {};
    this.custom=true;
  }

  setService(index){
    this.custom=false;
    this.selectedService = this.services[0][index];
    let n = this.selectedService.cardPricingDetail;
    this.taskCostPerHour = n.toFixed(2);
    this.taskTitle = this.selectedService.cardTitle
    this.selectedServiceLabel = this.selectedService.cardTitle;
  }

  setStatus(status){
    this.task.taskStatus = status;
  }

  calculateTotal(){
    if(this.taskActualEffort){
      let n = this.taskCostPerHour * this.taskActualEffort
      this.actualCost = n.toFixed(2);
    }

    if(this.task.taskEstimatedEffort){
      let n1 = this.taskCostPerHour * this.task.taskEstimatedEffort
      this.estimatedCost = n1.toFixed(2);
    }

    if(this.taskEstimatedEffort){
      let n1 = this.taskCostPerHour * this.taskEstimatedEffort
      this.estimatedCost = n1.toFixed(2);
    }

    if(this.taskCostPerHour){
      let n3 = this.taskCostPerHour*1;
      this.taskCostPerHour = n3.toFixed(2);
    }

    if(isNaN(this.estimatedCost)){
      this.estimatedCost = 0.00
    }

  }

  submitNewTask(){
    if(!this.taskUser.userId){
      this.taskUser = this.user
    }

    this.getUserDetails();

    let today = new Date();
    let month;
    let day;
    if ((today.getMonth()+1)<10){
      month = '0' + (today.getMonth()+1);
    }else{
      month = today.getMonth()+1
    }
    if (today.getDate()<10){
      day = '0' + (today.getDate());
    }else{
      day = today.getDate()
    }
    let todaysDate = today.getFullYear()+'-'+month+'-'+day;
    this.task.taskSubmittedDate = todaysDate;
    this.task.taskFinalCost=null;
    this.task.taskActualEffort = null;
    this.task.taskCompletedDate = null;
    this.task.taskId = 0;
    this.task.taskName = this.taskTitle;
    this.task.taskDesc = this.task.taskDesc;
    this.task.taskDueDate = this.task.taskDueDate;
    this.task.taskEstimatedEffort = this.taskEstimatedEffort;
    this.task.taskCostPerHour = this.taskCostPerHour;
    this.task.taskStatus = this.task.taskStatus;
    this.task.taskEstimatedCost = this.estimatedCost;
    this.task.invoice = null;
    this.task.user = this.taskUser;
    this.task.adminId = this.adminId;

    this.taskService.createTask(this.task).pipe(first()).subscribe((task) => {
      if (task) {
        this.appComponent.alert('success', 'Task Successfully Added!')
        this.router.navigate(['/view-tasks']);
      }else{
        this.appComponent.alert('warning', 'Error adding task')
      };
    }, (error) => { this.appComponent.alert('danger', 'Server error! Please try again later') });
  }

  updateTask(){
    this.getUserDetails();

    let today = new Date();
    let month;
    let day;
    if ((today.getMonth()+1)<10){
      month = '0' + (today.getMonth()+1);
    }
    if (today.getDate()<10){
      day = '0' + (today.getDate());
    }
    let todaysDate = today.getFullYear()+'-'+month+'-'+day;
    if(this.task.taskStatus == 'Completed'){
      this.task.taskCompletedDate = todaysDate;
      if(!this.taskActualEffort || !this.actualCost || this.taskActualEffort == 0){
        window.scrollTo(0, 0)
        this.appComponent.alert('warning', 'Actual Effort cannot be Zero!')
        return;
      }
    }
    if(!this.taskActualEffort){
      this.task.taskActualEffort = null;
    }else{
      this.task.taskActualEffort=this.taskActualEffort;
    }
    if(!this.actualCost){
      this.task.taskFinalCost=null;
    }else{
      this.task.taskFinalCost = this.actualCost
    }
    if (!this.task.taskId){
      this.task.taskId=0;
    }
    this.task.taskName = this.taskTitle;
    this.task.taskDesc = this.task.taskDesc;
    this.task.taskDueDate = this.task.taskDueDate;
    this.task.taskEstimatedEffort = this.taskEstimatedEffort;
    this.task.taskCostPerHour = this.taskCostPerHour;
    this.task.taskStatus = this.task.taskStatus;
    this.task.taskEstimatedCost = this.estimatedCost;
    this.task.user = this.task.user;
    this.task.invoice = null;
    this.task.adminId = this.adminId;

    this.taskService.updateTask(this.task).pipe(first()).subscribe((task) => {
      if (task) {
        this.appComponent.alert('success', 'Task Successfully Updated!')
        this.router.navigate(['/view-tasks']);
      }else{
        this.appComponent.alert('warning', 'Error adding task')
      };
    }, (error) => { this.appComponent.alert('danger', 'Server error! Please try again later') });
  }

  getUserDetails(){
    this.userService.getUserByEmail(this.user).pipe(first()).subscribe((user) => {
      if (user) {
        this.user=user;
      }
    }, (error) => { this.appComponent.alert('danger', 'Server error! Please try again later') });
  }

  confirmDeleteTask(){
    if(this.confirmDelete){
      this.confirmDelete = false;
    }else{
      this.confirmDelete=true;
    }
  }

  deleteTask(){
    this.taskService.deleteTask(this.task).pipe(first()).subscribe((task) => {
      if (task) {
        this.router.navigate(['/view-tasks']);
        this.appComponent.alert('success', 'You have successfully deleted this task!')
      }
    }, (error) => { this.appComponent.alert('danger', 'Server error! Please try again later') });
  }

  getAllUsers(){
    this.userService.getUsersByAdmin(this.user.myAdminPassphrase).pipe(first()).subscribe((users) => {
      if (users) {
        this.users.push(users);
      }else{
        this.appComponent.alert('warning', 'No Users Currently Available for filter')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Users! Please try again later!') });
  }
  getUser(i){
    this.taskUser = this.users[0][i];
    this.viewingUser = this.taskUser.businessName;
  }
}
