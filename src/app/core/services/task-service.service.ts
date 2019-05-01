import { Injectable } from '@angular/core';
import { Task } from './../models/task.model'

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor() { }
  task: Task = { };
  service = [];

  task1: Task = {};
  task2: Task = {};
  task3: Task = {};
  task4: Task = {};
  task5: Task = {};
  task6: Task = {};
  task7: Task = {};
  task8: Task = {};
  task9: Task = {};
  today = new Date();

  tasks = [];

  setTaskData(){
    this.task1.taskId=1
    this.task1.taskName='Phone Calls'
    this.task1.taskDesc = 'Make a ton of calls'
    this.task1.taskSubmittedDate = this.today;
    this.task1.taskDueDate = this.today
    this.task1.taskStatus = 'Not yet started'
    this.task1.taskEstimatedCost = 144
    this.task1.taskFinalCost = 144
    this.task1.taskEstimatedEffort = 12
    this.task1.taskActualEffort = 19
    this.task1.taskCostPerHour = 10

    this.task2.taskId=1
    this.task2.taskName='Phone'
    this.task2.taskDesc = 'Make a ton of calls'
    this.task2.taskSubmittedDate = this.today;
    this.task2.taskDueDate = this.today
    this.task2.taskStatus = 'Completed'
    this.task2.taskEstimatedCost = 150
    this.task2.taskFinalCost = 144
    this.task2.taskEstimatedEffort = 12
    this.task2.taskActualEffort = 13
    this.task2.taskCostPerHour = 10
    
    this.task3.taskId=1
    this.task3.taskName='Calls'
    this.task3.taskDesc = 'Make a ton of calls'
    this.task3.taskSubmittedDate = this.today;
    this.task3.taskDueDate = this.today
    this.task3.taskStatus = 'In progress'
    this.task3.taskEstimatedCost = 160
    this.task3.taskFinalCost = 144
    this.task3.taskEstimatedEffort = 12
    this.task3.taskActualEffort = 9
    this.task3.taskCostPerHour = 10
    
    this.task4.taskId=1
    this.task4.taskName='email Calls'
    this.task4.taskDesc = 'Make a ton of calls'
    this.task4.taskSubmittedDate = this.today;
    this.task4.taskDueDate = this.today
    this.task4.taskStatus = 'Completed'
    this.task4.taskEstimatedCost = 170
    this.task4.taskFinalCost = 144
    this.task4.taskEstimatedEffort = 12
    this.task4.taskActualEffort = 12
    this.task4.taskCostPerHour = 10
    
    this.task5.taskId=1
    this.task5.taskName='another Calls'
    this.task5.taskDesc = 'Make a ton of calls'
    this.task5.taskSubmittedDate = this.today;
    this.task5.taskDueDate = this.today
    this.task5.taskStatus = 'Not yet started'
    this.task5.taskEstimatedCost = 180
    this.task5.taskFinalCost = 144
    this.task5.taskEstimatedEffort = 12
    this.task5.taskActualEffort = 14
    this.task5.taskCostPerHour = 10
    
    this.task6.taskId=1
    this.task6.taskName='2 Calls'
    this.task6.taskDesc = 'Make a ton of calls'
    this.task6.taskSubmittedDate = this.today;
    this.task6.taskDueDate = this.today
    this.task6.taskStatus = 'Completed'
    this.task6.taskEstimatedCost = 190
    this.task6.taskFinalCost = 144
    this.task6.taskEstimatedEffort = 12
    this.task6.taskActualEffort = 11
    this.task6.taskCostPerHour = 10
    
    this.task7.taskId=1
    this.task7.taskName='Phone emails'
    this.task7.taskDesc = 'Make a ton of calls'
    this.task7.taskSubmittedDate = this.today;
    this.task7.taskDueDate = this.today
    this.task7.taskStatus = 'In progress'
    this.task7.taskEstimatedCost = 182
    this.task7.taskFinalCost = 144
    this.task7.taskEstimatedEffort = 12
    this.task7.taskActualEffort = 12
    this.task7.taskCostPerHour = 10
    
    this.task8.taskId=1
    this.task8.taskName='schedule Calls'
    this.task8.taskDesc = 'Make a ton of calls'
    this.task8.taskSubmittedDate = this.today;
    this.task8.taskDueDate = this.today
    this.task8.taskStatus = 'Not yet started'
    this.task8.taskEstimatedCost = 182
    this.task8.taskFinalCost = 144
    this.task8.taskEstimatedEffort = 12
    this.task8.taskActualEffort = 13
    this.task8.taskCostPerHour = 10
    
    this.task9.taskId=1
    this.task9.taskName='Phone scheudle'
    this.task9.taskDesc = 'Make a ton of calls'
    this.task9.taskSubmittedDate = this.today;
    this.task9.taskDueDate = this.today
    this.task9.taskStatus = 'Not yet started'
    this.task9.taskEstimatedCost = 144
    this.task9.taskFinalCost = 144
    this.task9.taskEstimatedEffort = 12
    this.task9.taskActualEffort = 13
    this.task9.taskCostPerHour = 10
    
    this.tasks.push(this.task1, this.task2, this.task3, this.task4, this.task5, this.task6, this.task7, this.task8, this.task9 )
  }

  setServiceData(service){
    this.service = service;
  }

  getServiceData(){
    return this.service;
  }

  getTasksByInvoiceId(id){
    this.tasks=[];
    this.setTaskData();
    for(let i=0; i<this.tasks.length;i++){
      if(this.tasks[i].length == id){
        return this.tasks[i];
      }
    }
  }

  getAllTasks(){
    this.tasks=[];
    this.setTaskData();
    console.log(this.tasks)
    return this.tasks;
  }

}
