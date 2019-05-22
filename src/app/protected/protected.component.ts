import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-secure',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent {

  constructor() { console.log("Protected endpont!"); }
  
}