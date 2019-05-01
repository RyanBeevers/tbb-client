import { Component, OnInit } from '@angular/core';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent implements OnInit {

  constructor() { }

  admin=true
  edit=false;
  tasks=[];
  task={};
  selectedTask = {};
  columns=['Task ID', 'Description', 'Due Date', 'Status', 'Submitted', 'Estimated Cost', '']
  id = [1,2,3,4,5];
  description=['Phone Calls', 'Send Emails', 'Call People', 'Schedule Appt', 'Reserve Hotel'];
  dueDate=['1/1/12', '1/2/13', '1/3/14', '1/4/15', '1/5/16'];
  status=['In Progress', 'Completed', 'In Progress', 'Not Yet Started', 'Completed'];
  submittedDate=['1/1/12', '1/2/13', '1/3/14', '1/4/15', '1/5/16'];
  estimatedCost=['1.99', '2.99', '3.99', '4.99', '5.99']
  ngOnInit() {
    window.scrollTo(0, 0)
    for (let i=0; i<this.id.length; i++){
      this.task={
        "id":this.id[i],
        "description":this.description[i],
        "dueDate":this.dueDate[i],
        "status": this.status[i],
        "submittedDate":this.submittedDate[i],
        "estimatedCost":this.estimatedCost[i],
      }
      this.tasks.push(this.task);
    }
    console.log(this.task);
  }

  editTask(i):void {
    this.selectedTask = this.tasks[i];
    $("#myModal").modal('show');
  }
  createTask(i):void {
    this.selectedTask = [];
    $("#myModal").modal('show');
  }
  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
    this.edit=false;
  }
}
