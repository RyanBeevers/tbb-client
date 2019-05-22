import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user.model';
import { Task } from '../core/models/task.model';
import { TaskService } from '../core/services/task.service';
import { UserService } from '../core/services/user.service';
import { first } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})

export class ViewTasksComponent implements OnInit {

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private appComponent: AppComponent,
    private router: Router,
  ) { }

  user: User = { };
  task: Task = { };
  tasks = [];
  columns=['Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Estimated Cost', '']

  users = [];
  viewingUser = 'All';
  taskUser: User = { };
  processing=false;
  selectedTask: Task = {};

  ngOnInit() {
    window.scrollTo(0, 0)
    if(!this.userService.isAuthenticated()){
      this.router.navigate(['/not-authorized']);
    }
    this.getAllUsers();
    this.user = JSON.parse(localStorage.getItem('user'));
    if(this.user.roleType=='admin'){
      this.columns=['Business Name', 'Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Cost*', '']
      this.getAllTasks();
    }
    else{
      this.columns=['Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Cost*', '']
      this.getTasksByUserId(this.user);
    }
  }

  getAllTasks(){
    this.viewingUser = 'All'
    this.columns=['Business Name', 'Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Cost*', '']
    this.tasks = [];
    this.taskService.getAllTasks().pipe(first()).subscribe((tasks) => {
      if (tasks) {
        this.tasks.push(tasks);
        console.log(this.tasks)
      }else{
        this.appComponent.alert('warning', 'No Tasks Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
  }

  getTasksByUserId(user){
    this.columns=['Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Cost*', '']
    this.tasks = [];
    this.taskService.getTasksByUserId(user).pipe(first()).subscribe((tasks) => {
      if (tasks) {
        this.tasks.push(tasks);
      }else{
        this.appComponent.alert('warning', 'No Tasks Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
  }

  getTasksByUserIdAdmin(user){
    this.columns=['Business Name', 'Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Estimated Cost', '']
    this.tasks = [];
    this.taskService.getTasksByUserId(user).pipe(first()).subscribe((tasks) => {
      if (tasks) {
        this.tasks.push(tasks);
      }else{
        this.appComponent.alert('warning', 'No Tasks Currently Available')
      };
    }, (error) => { this.appComponent.alert('danger', 'Error retrieving Tasks! Please try again later!') });
  }

  createOrEditTask(index){
    if (index>=0){
      localStorage.setItem('selectedTask', JSON.stringify(this.tasks[0][index]))
    }
    this.router.navigate(['/new-task']);
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
    this.taskUser = this.users[0][i];
    this.getTasksByUserIdAdmin(this.taskUser);
    this.viewingUser = this.taskUser.businessName;
  }
  
  viewIncomplete(){
    this.processing=true;
    if(this.viewingUser != 'All'){
      this.getTasksByUserId(this.taskUser)
    }else if (this.user.roleType=='admin'){
      this.getAllTasks();
    }else{
      this.getTasksByUserId(this.user)
    }
    setTimeout(() => {
    let n = this.tasks[0].length;
    for(let i=0;i<n;i++){
      if(this.tasks[0][i].taskStatus == 'Completed'){
        this.tasks[0].splice(i, 1);
        i--;
        n--;
      }
      this.processing=false;
    }
    }, 500)
  }

  viewCompleted(){
    this.processing=true;
    if(this.viewingUser != 'All'){
      this.getTasksByUserId(this.taskUser)
    }else if (this.user.roleType=='admin'){
      this.getAllTasks();
    }else{
      this.getTasksByUserId(this.user)
    }
    setTimeout(() => {
    let n = this.tasks[0].length;
    for(let i=0;i<n;i++){
      if(this.tasks[0][i].taskStatus != 'Completed'){
        this.tasks[0].splice(i, 1);
        i--;
        n--;
      }
      this.processing=false;
    }
    }, 500)
  }

  viewAll(){
    if(this.viewingUser != 'All'){
      this.getTasksByUserId(this.taskUser)
    }else if (this.user.roleType=='admin'){
      this.getAllTasks();
    }else{
      this.getTasksByUserId(this.user)
    }
  }

  showModal(i):void {
    this.selectedTask = this.tasks[0][i]
    $("#myModal").modal('show');
  }
  sendModal(): void {
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }
}
