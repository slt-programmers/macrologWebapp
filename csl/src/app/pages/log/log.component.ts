import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

	public modalIsVisible: boolean = false;

	constructor(private http: HttpClient) { }

	public days;

	public goalP: number = 120;
	public goalF: number = 140;
	public goalC: number = 35;

	ngOnInit() {
		this.getJson().subscribe(data => this.days = data,
					error => console.log(error));
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

	private getJson() {
		return this.http.get("assets/logentries.json");
	}

}
