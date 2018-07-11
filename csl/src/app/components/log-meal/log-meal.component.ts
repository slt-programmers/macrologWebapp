import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, ElementRef, Input } from '@angular/core';
import {LogEntry} from '../../model/logEntry';

@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss']
})
export class LogMealComponent implements OnInit {

  @Input() meal:string;
  @Input() logEntries:LogEntry[];

  constructor() { }

  ngOnInit() {

  }

	onChange() {
	}


}
