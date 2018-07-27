import { Component, OnInit, AfterViewInit, Output, Renderer2, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent implements OnInit, AfterViewInit {

	@ViewChildren('dayRef') dayRefs: QueryList<any>;

	@Output() change = new EventEmitter<Date>()

	public dateformat = 'dd-MM-yyyy';
	public today: Date;
	public selectedDate: Date;
	public daysInMonth: number;
	public daysInMonthArray = new Array();
	public weekdays = new Array();
	public placeholders = new Array();
	public isOpen: boolean = false;

  constructor(private renderer: Renderer2) {
    this.today = new Date();
		this.selectedDate = this.today;
		this.setDaysInMonthArray();
		this.setWeekdays();
		this.getWeekdayPlaceholders();
  }

	ngAfterViewInit() {
		this.dayRefs.changes.subscribe(changes => {
			changes.toArray().forEach(item => {
				this.removeMark(item);
				this.markIfToday(item);
			})
		});
	}

  ngOnInit() {
  }

	toggleOpen() {
		this.isOpen = !this.isOpen;
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
		this.ngAfterViewInit();
	}

	previousMonth() {
		this.selectedDate = new Date(this.selectedDate.getFullYear(),
			this.selectedDate.getMonth() - 1, this.selectedDate.getDate());
		this.setDaysInMonthArray();
		this.getWeekdayPlaceholders();
		this.ngAfterViewInit();
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

	markIfToday(item: ElementRef) {
		if (this.selectedDate.getMonth() == this.today.getMonth()) {
			if(item.nativeElement.textContent == this.selectedDate.getDate()) {
				this.renderer.addClass(item.nativeElement, 'picker__day--today');
			}
		}
	}

	removeMark(item) {
		if (item.nativeElement.classList.contains('picker__day--today')) {
			this.renderer.removeClass(item.nativeElement, 'picker__day--today');
		}
	}

}
