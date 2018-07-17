import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent implements OnInit {

	@Output() change = new EventEmitter<Date>()

	public dateformat = 'dd-MM-yyyy';
	public today: Date;
	public selectedDate: Date;
	public daysInMonth: number;
	public daysInMonthArray = new Array();
	public weekdays = new Array();
	public placeholders = new Array();
	public isOpen: boolean = false;

  constructor() {
    this.today = new Date();
		this.selectedDate = this.today;
		this.setDaysInMonthArray();
		this.setWeekdays();
		this.getWeekdayPlaceholders();
  }

  ngOnInit() {
  }

	nextDay() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), this.selectedDate.getDate() + 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.change.emit(this.selectedDate);
	}

	previousDay() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.change.emit(this.selectedDate);
	}

	nextMonth() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth() + 1, this.selectedDate.getDate());
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
	}

	previousMonth() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth() - 1, this.selectedDate.getDate());
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
	}

	selectDay(day: number) {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth(), day);
		this.isOpen = false;
		this.change.emit(this.selectedDate);
	}

	setDaysInMonthArray() {
		this.daysInMonthArray = new Array();
		this.daysInMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
		for (let i = 1; i <= this.daysInMonth; i++) {
			this.daysInMonthArray.push(i);
		}
	}

	setWeekdays() {
		this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	}

	getWeekdayPlaceholders() {
		this.placeholders = new Array();
		let firstOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
		let dayOfWeek = firstOfMonth.getDay();

		for (let i = 0; i < dayOfWeek; i++) {
			this.placeholders.push(i);
		}
	}

}
