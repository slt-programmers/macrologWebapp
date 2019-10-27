import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HealthcheckService } from './services/healthcheck.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	private asleep = true;

	constructor(public router: Router,
		private healthcheckService: HealthcheckService) {
	}

	ngOnInit() {
		this.healthcheckService.checkState().subscribe(
			result => {
				this.asleep = !result;
			},
			error => {
				if (error.status === 403) {
					this.asleep = !error;
				}
			});
	}

	public isAsleep(): boolean {
		return this.asleep;
	}
}
