import { DatePipe, formatDate } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ml-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  imports: [DatePipe, FontAwesomeModule]
})
export class DatepickerComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  private readonly defautlInitialDate = new Date();
  
  readonly initialDate = input<Date>(this.defautlInitialDate);
  readonly showArrows = input<boolean>(true);
  readonly dateSelected = output<string>();

  readonly dateformat = 'dd-MM-yyyy';
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  selectedDate = this.defautlInitialDate;
  daysInMonth = 30;
  daysInMonthArray: number[] = [];
  placeholders: number[] = [];
  isOpen = false;

  constructor() {
    effect(() => {
      this.selectedDate = this.initialDate();
    })
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  toggleOpen(event?: Event): void {
    if (event) {
      if (event.target && event.target instanceof HTMLElement && event.target.classList.value === 'overlay') {
        this.isOpen = !this.isOpen;
      }
    } else {
      this.isOpen = !this.isOpen;
    }
  }

  nextDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.dateSelected.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  previousDay() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() - 1
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
    this.dateSelected.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  nextMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  previousMonth() {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() - 1,
      this.selectedDate.getDate()
    );
    this.setDaysInMonthArray();
    this.getWeekdayPlaceholders();
  }

  selectDay(day: number) {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      day
    );
    this.isOpen = false;
    this.dateSelected.emit(formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US'));
  }

  private setDaysInMonthArray() {
    this.daysInMonthArray = [];
    this.daysInMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= this.daysInMonth; i++) {
      this.daysInMonthArray.push(i);
    }
  }

  private getWeekdayPlaceholders() {
    this.placeholders = [];
    const firstOfMonth = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      1
    );
    const dayOfWeek = firstOfMonth.getDay();

    for (let i = 0; i < dayOfWeek; i++) {
      this.placeholders.push(i);
    }
  }
}
