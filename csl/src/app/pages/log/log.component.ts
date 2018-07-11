import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LogService}from '../../services/log.service';
import {LogEntry} from '../../model/logEntry';

@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

	public modalIsVisible: boolean = false;

	constructor(private http: HttpClient,private logService: LogService) { }

	public days;
  public allLogs;
  public displayDate = new Date();

  public breakfastLogs = new Array<LogEntry>();
  public lunchLogs = new Array<LogEntry>();
  public dinnerLogs = new Array<LogEntry>();
  public snacksLogs = new Array<LogEntry>();

	public goalP: number = 120;
	public goalF: number = 140;
	public goalC: number = 35;
	public goalCal: number = 1235;

	ngOnInit() {
		this.getJson().subscribe(data => this.days = data,
					error => console.log(error));
    this.logService.getAllLogs().subscribe(
      data => {
          this.allLogs = data;
          this.breakfastLogs = this.allLogs.filter(
              entry => entry.meal === 'BREAKFAST'
          );
          this.lunchLogs = this.allLogs.filter(
              entry => entry.meal === 'LUNCH'
          );
          this.dinnerLogs = this.allLogs.filter(
              entry => entry.meal === 'DINNER'
          );
          this.snacksLogs = this.allLogs.filter(
              entry => entry.meal === 'SNACKS'
          );

      }

		);

  }

	public getTotal(meals, macro) {
		let total = 0.0;
		for (let meal of meals) {
			for (let ingredient of meal.ingredients) {
				total += ingredient[macro];
			}
		}
		return total;
	}

	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal(event) {
		this.modalIsVisible = false;
	}

	private getJson() {
		return this.http.get("assets/logentries.json");
	}

}
