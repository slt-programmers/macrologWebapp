import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LogService}from '../../services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

	constructor(private http: HttpClient,private logService: LogService) { }

	public days;
  public allLogs;

	ngOnInit() {
		this.getJson().subscribe(data => this.days = data,
					error => console.log(error));

    this.logService.getAllLogs().subscribe(
      data => this.allLogs = data
		);
  }

	public getTotal(meals, macro) {
		let total = 0.0;
		for (let meal of meals) {
			for (let ingredient of meal.ingredients) {
				console.log(ingredient[macro]);
				total += ingredient[macro];
			}
		}
		return total;
	}

	private getJson() {
		return this.http.get("assets/logentries.json");
	}



}
