import { Component, OnInit } from '@angular/core';
import {LogService}from '../../services/log.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html'
})
export class GraphsComponent implements OnInit {

  constructor(private logService: LogService) { }

  ngOnInit() {
     this.getMacros();
  }


  getMacros(){
    let pipe = new DatePipe('en-US');
    let fetchDate = pipe.transform(new Date(),'dd-MM-yyyy');
    let fetchDate2 = pipe.transform(new Date(),'dd-MM-yyyy');
    this.logService.getMacros(fetchDate,fetchDate2).subscribe(
      data => {
          this.macrosMonth = data;
      }
  }

}
