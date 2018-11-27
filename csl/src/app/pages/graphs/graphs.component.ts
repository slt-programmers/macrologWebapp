import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {LogService} from '../../services/log.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-graphs',
	templateUrl: './graphs.component.html'
})
export class GraphsComponent implements OnInit, AfterViewChecked {

	public macrosMonth;

	constructor(private logService: LogService, private sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.getMacros();
	}

	ngAfterViewChecked() {
		const pipe = new DatePipe('en-US');
		for (const dayMacro of this.macrosMonth) {
			const fetchDate = pipe.transform(dayMacro.day, 'ddMMyyyy');
			const protein = document.getElementById('protein_' + fetchDate);
			const fat = document.getElementById('fat_' + fetchDate);
			const carbs = document.getElementById('carbs_' + fetchDate);
			const available = document.getElementById('day_' + fetchDate);

			if (!protein || !fat || !carbs || !available) {
				return;
			}

			const availableHeight = available.style.height; // = 100%

			protein.style.height = Math.round(dayMacro.macro.protein) + 'px';
			fat.style.height = Math.round(dayMacro.macro.fat) + 'px';
			carbs.style.height = Math.round(dayMacro.macro.carbs) + 'px';
		}
	}

	public getMacros() {
		const pipe = new DatePipe('en-US');
		const fetchDate = pipe.transform(new Date(), 'dd-MM-yyyy');
		const fetchDate2 = pipe.transform(new Date(), 'dd-MM-yyyy');
		this.logService.getMacros(fetchDate, fetchDate2).subscribe(
			data => {
				this.macrosMonth = data;
			});
	}
}
